'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { advanceExecution, cancelExecution, createNewVersion, failExecution, publishWorkflow } from '../store/slice';
import { ExecutionStatus, StepType, WorkflowStatus } from '../types';

const STEP_TYPE_COLOR: Record<StepType, string> = {
  [StepType.Trigger]:  'bg-blue-100 text-blue-700',
  [StepType.Human]:    'bg-amber-100 text-amber-700',
  [StepType.System]:   'bg-green-100 text-green-700',
  [StepType.Decision]: 'bg-purple-100 text-purple-700',
  [StepType.Watcher]:  'bg-gray-100 text-gray-600',
};

export function WorkflowDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getWorkflowById, getExecutionsByWorkflowId } = useWorkflowModule();
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Workflow not found</h1>
        <p className="text-sm text-muted-foreground">This workflow id does not exist.</p>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to workflows
        </Link>
      </div>
    );
  }

  const executions = getExecutionsByWorkflowId(workflow.id);

  return (
    <div className="space-y-6">
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
            <button onClick={() => dispatch(publishWorkflow(workflow.id))} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
              Publish
            </button>
          )}
          {workflow.status === WorkflowStatus.Published && (
            <button onClick={() => dispatch(createNewVersion(workflow.id))} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
              New version
            </button>
          )}
          <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            Back
          </Link>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">Steps</h2>
        <ol className="space-y-2">
          {workflow.steps.map((step) => (
            <li key={step.id} className="flex items-start gap-3 border rounded-md p-3">
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0 mt-0.5">{step.order}.</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{step.nameAr}</p>
                <p className="text-xs text-muted-foreground">{step.nameEn}</p>
                {step.assigneeType && (
                  <p className="text-xs text-muted-foreground">Assignee: {step.assigneeType}</p>
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

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">Executions</h2>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No execution instances for this workflow yet.</p>
        ) : (
          <ul className="space-y-2">
            {executions.map((exe) => {
              const currentStep = workflow.steps.find((s) => s.id === exe.currentStepId);
              return (
                <li key={exe.id} className="border rounded-md p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs font-medium">{exe.entityType} / {exe.entityId}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentStep ? `Current step: ${currentStep.nameEn}` : 'Completed'}
                      </p>
                      <p className="text-xs text-muted-foreground">Started: {exe.startedAt.slice(0, 10)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs">{exe.status}</span>
                      {exe.status === ExecutionStatus.Running && (
                        <div className="flex gap-1">
                          <button onClick={() => dispatch(advanceExecution(exe.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                            Advance
                          </button>
                          <button onClick={() => dispatch(cancelExecution(exe.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                            Cancel
                          </button>
                          <button onClick={() => dispatch(failExecution(exe.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                            Fail
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
