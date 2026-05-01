'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import {
  addExecution,
  advanceExecution, cancelExecution, createNewVersion, deleteWorkflow,
  failExecution, publishWorkflow,
} from '../store/slice';
import { ExecutionStatus, StepType, TriggerType, WorkflowStatus } from '../types';

const STEP_TYPE_COLOR: Record<StepType, string> = {
  [StepType.Trigger]:  'bg-blue-100 text-blue-700',
  [StepType.Human]:    'bg-amber-100 text-amber-700',
  [StepType.System]:   'bg-green-100 text-green-700',
  [StepType.Decision]: 'bg-purple-100 text-purple-700',
  [StepType.Watcher]:  'bg-gray-100 text-gray-600',
};

const EXEC_BADGE: Record<ExecutionStatus, string> = {
  [ExecutionStatus.Running]:   'bg-blue-100 text-blue-700',
  [ExecutionStatus.Completed]: 'bg-green-100 text-green-700',
  [ExecutionStatus.Failed]:    'bg-red-100 text-red-700',
  [ExecutionStatus.Cancelled]: 'bg-gray-100 text-gray-600',
  [ExecutionStatus.Escalated]: 'bg-amber-100 text-amber-700',
};

export function WorkflowDetailPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { local, id } = useParams<{ local: string; id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { getWorkflowById, getExecutionsByWorkflowId, getVersionHistory } = useWorkflowModule();
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Workflow not found</h1>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← Back to workflows
        </Link>
      </div>
    );
  }

  const executions     = getExecutionsByWorkflowId(workflow.id);
  const versionHistory = getVersionHistory(workflow.id);

  const triggerStep = workflow.steps.find((s) => s.stepType === StepType.Trigger);
  const isManual    = triggerStep?.triggerType === TriggerType.Manual;

  function startManualExecution() {
    if (!triggerStep || !workflow) return;
    const wf          = workflow;
    const firstEdge   = wf.edges.find((e) => e.source === triggerStep.id);
    const firstStepId = firstEdge?.target ?? triggerStep.id;
    const now         = new Date().toISOString();
    const executionId = `exe-${crypto.randomUUID()}`;
    dispatch(addExecution({
      id:                   executionId,
      wfId:                 wf.id,
      entityType:           wf.type,
      entityId:             `manual-${executionId}`,
      status:               ExecutionStatus.Running,
      startedAt:            now,
      currentStepId:        firstStepId,
      currentStepStartedAt: now,
      actionHistory:        [],
    }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{workflow.nameAr}</h1>
          <p className="text-sm text-muted-foreground">{workflow.nameEn}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted">{workflow.type}</span>
            <span className="text-xs">{workflow.status}</span>
            <span className="text-xs text-muted-foreground">v{workflow.version}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {workflow.status === WorkflowStatus.Draft && (
            <>
              <Link href={`/${local}/workflow/${workflow.id}/edit`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
                Edit in Designer
              </Link>
              <button
                onClick={() => dispatch(publishWorkflow(workflow.id))}
                className="h-9 px-3 rounded-md border border-green-200 text-green-700 text-sm hover:bg-green-50"
              >
                Publish
              </button>
            </>
          )}
          {workflow.status === WorkflowStatus.Published && isManual && (
            <button
              onClick={startManualExecution}
              className="h-9 px-3 rounded-md border border-blue-200 text-blue-700 text-sm hover:bg-blue-50"
            >
              Start Execution
            </button>
          )}
          {workflow.status === WorkflowStatus.Published && (
            <button
              onClick={() => dispatch(createNewVersion(workflow.id))}
              className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
            >
              New version
            </button>
          )}
          {workflow.status === WorkflowStatus.Draft && (
            <button
              onClick={() => { dispatch(deleteWorkflow(workflow.id)); router.push(`/${local}/workflow`); }}
              className="h-9 px-3 rounded-md border border-red-200 text-red-600 text-sm hover:bg-red-50"
            >
              Delete Draft
            </button>
          )}
          <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            ← Back
          </Link>
        </div>
      </div>

      {/* Steps */}
      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Steps ({workflow.steps.length})</h2>
        <ol className="space-y-2">
          {workflow.steps.map((step, idx) => (
            <li key={step.id} className="flex items-start gap-3 border rounded-md p-3">
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0 mt-0.5">{idx + 1}.</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{step.nameAr}</p>
                <p className="text-xs text-muted-foreground">{step.nameEn}</p>
                {step.assigneeType && (
                  <p className="text-xs text-muted-foreground">
                    Assignee: {step.assigneeType} / {step.assigneeId ?? '—'}
                  </p>
                )}
                {step.actions && step.actions.length > 0 && (
                  <p className="text-xs text-muted-foreground">Actions: {step.actions.join(', ')}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STEP_TYPE_COLOR[step.stepType]}`}>
                  {step.stepType}
                </span>
                {step.slaHours && (
                  <span className="text-xs text-muted-foreground">SLA {step.slaHours}h</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Edges */}
      {workflow.edges.length > 0 && (
        <section className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold mb-3 text-sm">Edges ({workflow.edges.length})</h2>
          <ul className="space-y-1">
            {workflow.edges.map((edge) => {
              const src = workflow.steps.find((s) => s.id === edge.source);
              const tgt = workflow.steps.find((s) => s.id === edge.target);
              return (
                <li key={edge.id} className="text-xs text-muted-foreground font-mono">
                  {src?.nameEn ?? edge.source} → {tgt?.nameEn ?? edge.target}
                  {edge.label && <span className="ml-2 px-1 bg-muted rounded">{edge.label}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Version history */}
      {versionHistory.length > 1 && (
        <section className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold mb-3 text-sm">Version history</h2>
          <ul className="space-y-2">
            {versionHistory.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 text-sm">
                <div>
                  <span className="font-mono text-xs text-muted-foreground mr-2">v{v.version}</span>
                  <span>{v.nameEn}</span>
                  {v.id === workflow.id && <span className="ml-2 text-xs text-primary">(current)</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${v.status === WorkflowStatus.Published ? 'bg-green-100 text-green-700' : v.status === WorkflowStatus.Draft ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                    {v.status}
                  </span>
                  {v.id !== workflow.id && (
                    <Link href={`/${local}/workflow/${v.id}`} className="text-xs text-primary hover:underline">
                      View
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Executions + audit trail */}
      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Executions ({executions.length})</h2>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No execution instances for this workflow yet.</p>
        ) : (
          <ul className="space-y-4">
            {executions.map((exe) => {
              const currentStep = workflow.steps.find((s) => s.id === exe.currentStepId);
              return (
                <li key={exe.id} className="border rounded-md p-3 text-sm space-y-3">
                  {/* Execution header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-medium">{exe.entityType} / {exe.entityId}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentStep ? `Current step: ${currentStep.nameEn}` : 'No active step'}
                      </p>
                      <p className="text-xs text-muted-foreground">Started: {exe.startedAt.slice(0, 10)}</p>
                      {exe.completedAt && (
                        <p className="text-xs text-muted-foreground">Completed: {exe.completedAt.slice(0, 10)}</p>
                      )}
                      {exe.escalatedTo && (
                        <p className="text-xs text-amber-700">Escalated → {exe.escalatedTo}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${EXEC_BADGE[exe.status]}`}>
                        {exe.status}
                      </span>
                      {exe.status === ExecutionStatus.Running && currentStep?.actions && (
                        <div className="flex gap-1 flex-wrap justify-end">
                          {currentStep.actions.map((act) => (
                            <button
                              key={act}
                              onClick={() =>
                                dispatch(
                                  advanceExecution({
                                    executionId: exe.id,
                                    action:      act,
                                    actorId:     user?.id ?? 'unknown',
                                  }),
                                )
                              }
                              className="text-xs h-7 px-2 rounded border hover:bg-muted"
                            >
                              {act}
                            </button>
                          ))}
                          <button
                            onClick={() => dispatch(cancelExecution(exe.id))}
                            className="text-xs h-7 px-2 rounded border text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => dispatch(failExecution(exe.id))}
                            className="text-xs h-7 px-2 rounded border hover:bg-muted"
                          >
                            Fail
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audit trail */}
                  {exe.actionHistory.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Audit trail</p>
                      <ul className="space-y-1">
                        {exe.actionHistory.map((record, i) => {
                          const step = workflow.steps.find((s) => s.id === record.stepId);
                          return (
                            <li key={i} className="text-xs flex items-baseline gap-2 text-muted-foreground">
                              <span className="shrink-0 font-mono">{record.takenAt.slice(0, 16).replace('T', ' ')}</span>
                              <span className="shrink-0 font-medium text-foreground">{record.action}</span>
                              <span>on {step?.nameEn ?? record.stepId}</span>
                              <span>by {record.actorId}</span>
                              {record.comment && <span className="italic">&quot;{record.comment}&quot;</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
