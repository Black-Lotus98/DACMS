'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, ClipboardList, Play } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { archiveWorkflow, cancelExecution, publishWorkflow } from '../store/slice';
import { ExecutionStatus, WorkflowStatus, WorkflowType } from '../types';

const STATUS_BADGE: Record<WorkflowStatus, string> = {
  [WorkflowStatus.Draft]:     'bg-gray-100 text-gray-600',
  [WorkflowStatus.Published]: 'bg-green-100 text-green-700',
  [WorkflowStatus.Archived]:  'bg-amber-100 text-amber-700',
};

const EXECUTION_BADGE: Record<ExecutionStatus, string> = {
  [ExecutionStatus.Running]:   'bg-blue-100 text-blue-700',
  [ExecutionStatus.Completed]: 'bg-green-100 text-green-700',
  [ExecutionStatus.Failed]:    'bg-red-100 text-red-700',
  [ExecutionStatus.Cancelled]: 'bg-gray-100 text-gray-600',
  [ExecutionStatus.Escalated]: 'bg-amber-100 text-amber-700',
};

// Group definitions by workflow type
function groupByType(workflows: ReturnType<ReturnType<typeof useWorkflowModule>['getWorkflowsByType']>) {
  return workflows.reduce<Record<string, typeof workflows>>((acc, wf) => {
    if (!acc[wf.type]) acc[wf.type] = [];
    acc[wf.type].push(wf);
    return acc;
  }, {});
}

export function WorkflowPage() {
  const dispatch = useAppDispatch();
  const { workflows, executions, getCurrentStep, slaAlerts } = useWorkflowModule();
  const { local } = useParams<{ local: string }>();

  const grouped = groupByType(workflows);
  const typeOrder: WorkflowType[] = [
    WorkflowType.Archiving, WorkflowType.Lending, WorkflowType.Destruction,
    WorkflowType.Migration, WorkflowType.Custom,
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workflow System</h1>
          <p className="text-sm text-muted-foreground">Manage approval workflows and monitor live executions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${local}/workflow/my-tasks`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            <ClipboardList className="w-4 h-4" />
            My Tasks
          </Link>
          <Link
            href={`/${local}/workflow/executions`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            <Play className="w-4 h-4" />
            Executions
          </Link>
          <Link
            href={`/${local}/workflow/new`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            <Plus className="w-4 h-4" />
            New workflow
          </Link>
        </div>
      </div>

      {/* SLA alerts */}
      {slaAlerts.length > 0 && (
        <div className="space-y-1">
          {slaAlerts.map((a) => (
            <div
              key={`${a.executionId}-${a.kind}`}
              className={`text-xs rounded-md border px-2 py-1 ${a.kind === 'BREACHED' ? 'border-red-300 bg-red-50 text-red-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}
            >
              SLA {a.kind === 'BREACHED' ? 'breached' : 'approaching'}: <strong>{a.workflowName}</strong> / {a.stepName} — {a.elapsedHours}h of {a.slaHours}h
            </div>
          ))}
        </div>
      )}

      {/* Workflow definitions grouped by type */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <h2 className="font-semibold text-sm">Workflow definitions</h2>
        {typeOrder.map((type) => {
          const wfs = grouped[type];
          if (!wfs?.length) return null;
          return (
            <div key={type}>
              <p className="text-xs font-mono text-muted-foreground mb-1">{type}</p>
              <div className="space-y-2">
                {wfs.map((wf) => (
                  <div key={wf.id} className="border rounded-md p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{wf.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{wf.nameEn}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_BADGE[wf.status]}`}>
                          {wf.status}
                        </span>
                        <span className="text-xs text-muted-foreground">v{wf.version}</span>
                        <span className="text-xs text-muted-foreground">{wf.steps.length} steps</span>
                        {wf.parentId && (
                          <span className="text-xs text-muted-foreground">parent: {wf.parentId}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/${local}/workflow/${wf.id}`} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                        View
                      </Link>
                      {wf.status === WorkflowStatus.Draft && (
                        <>
                          <Link href={`/${local}/workflow/${wf.id}/edit`} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                            Edit
                          </Link>
                          <button
                            onClick={() => dispatch(publishWorkflow(wf.id))}
                            className="text-xs h-7 px-2 rounded border border-green-200 text-green-700 hover:bg-green-50"
                          >
                            Publish
                          </button>
                        </>
                      )}
                      {wf.status === WorkflowStatus.Published && (
                        <button
                          onClick={() => dispatch(archiveWorkflow(wf.id))}
                          className="text-xs h-7 px-2 rounded border hover:bg-muted"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Recent executions summary */}
      <section className="rounded-xl border bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Recent executions</h2>
          <Link href={`/${local}/workflow/executions`} className="text-xs text-primary hover:underline">
            View all →
          </Link>
        </div>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No executions yet.</p>
        ) : (
          <ul className="space-y-2">
            {executions.slice(0, 5).map((exe) => {
              const currentStep = getCurrentStep(exe.id);
              return (
                <li key={exe.id} className="border rounded-md p-3 text-sm flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium font-mono text-xs">{exe.entityType} / {exe.entityId}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentStep ? `Step: ${currentStep.nameEn}` : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${EXECUTION_BADGE[exe.status]}`}>
                      {exe.status}
                    </span>
                    {exe.status === ExecutionStatus.Running && (
                      <button
                        onClick={() => dispatch(cancelExecution(exe.id))}
                        className="text-xs h-7 px-2 rounded border hover:bg-muted"
                      >
                        Cancel
                      </button>
                    )}
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
