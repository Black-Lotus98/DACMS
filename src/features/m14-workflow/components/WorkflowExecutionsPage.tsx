'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { cancelExecution, escalateExecution, retryExecution } from '../store/slice';
import { ExecutionStatus } from '../types';

const STATUS_BADGE: Record<ExecutionStatus, string> = {
  [ExecutionStatus.Running]:   'bg-blue-100 text-blue-700',
  [ExecutionStatus.Completed]: 'bg-green-100 text-green-700',
  [ExecutionStatus.Failed]:    'bg-red-100 text-red-700',
  [ExecutionStatus.Cancelled]: 'bg-gray-100 text-gray-600',
  [ExecutionStatus.Escalated]: 'bg-amber-100 text-amber-700',
};

export function WorkflowExecutionsPage() {
  const dispatch   = useAppDispatch();
  const { local }  = useParams<{ local: string }>();
  const { executions, getWorkflowById, getCurrentStep, slaAlerts } = useWorkflowModule();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Execution Monitor</h1>
        <p className="text-sm text-muted-foreground">All workflow execution instances across the system.</p>
      </div>

      {slaAlerts.length > 0 && (
        <div className="space-y-1">
          {slaAlerts.map((a) => (
            <div
              key={`${a.executionId}-${a.kind}`}
              className={`text-xs rounded-md border px-2 py-1 flex items-center justify-between ${a.kind === 'BREACHED' ? 'border-red-300 bg-red-50 text-red-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}
            >
              <span>
                SLA {a.kind === 'BREACHED' ? 'breached' : 'approaching'}: <strong>{a.workflowName}</strong> / {a.stepName} ({a.elapsedHours}h / {a.slaHours}h)
              </span>
              {a.kind === 'BREACHED' && (
                <button
                  onClick={() =>
                    dispatch(escalateExecution({ executionId: a.executionId, escalatedTo: 'center-director' }))
                  }
                  className="ml-4 text-xs h-6 px-2 rounded border border-red-300 hover:bg-red-100"
                >
                  Escalate
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold text-sm">All executions ({executions.length})</h2>
        </div>

        {executions.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No executions yet.</p>
        ) : (
          <div className="divide-y">
            {executions.map((exe) => {
              const wf          = getWorkflowById(exe.wfId);
              const currentStep = getCurrentStep(exe.id);
              const slaAlert    = slaAlerts.find((a) => a.executionId === exe.id);

              return (
                <div key={exe.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {wf?.nameEn ?? exe.wfId}
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{exe.entityType}/{exe.entityId}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentStep ? `Current step: ${currentStep.nameEn}` : exe.status === ExecutionStatus.Completed ? 'Completed' : '—'}
                      {exe.escalatedTo && <span className="ml-2 text-amber-700">Escalated → {exe.escalatedTo}</span>}
                    </p>
                    {slaAlert && (
                      <span className={`inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium ${slaAlert.kind === 'BREACHED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        SLA {slaAlert.kind === 'BREACHED' ? 'breached' : 'warning'}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Started: {exe.startedAt.slice(0, 10)}
                      {exe.completedAt && ` · Ended: ${exe.completedAt.slice(0, 10)}`}
                    </p>
                    {exe.actionHistory.length > 0 && (
                      <p className="text-xs text-muted-foreground">{exe.actionHistory.length} actions recorded</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_BADGE[exe.status]}`}>
                      {exe.status}
                    </span>

                    {wf && (
                      <Link
                        href={`/${local}/workflow/${wf.id}`}
                        className="text-xs h-7 px-2 rounded border hover:bg-muted"
                      >
                        Workflow
                      </Link>
                    )}

                    {exe.status === ExecutionStatus.Running && (
                      <button
                        onClick={() => dispatch(cancelExecution(exe.id))}
                        className="text-xs h-7 px-2 rounded border hover:bg-muted text-red-600 border-red-200"
                      >
                        Cancel
                      </button>
                    )}

                    {(exe.status === ExecutionStatus.Failed || exe.status === ExecutionStatus.Escalated) && exe.currentStepId && (
                      <button
                        onClick={() =>
                          dispatch(retryExecution({ executionId: exe.id, fromStepId: exe.currentStepId! }))
                        }
                        className="text-xs h-7 px-2 rounded border hover:bg-muted"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
