'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { archiveWorkflow, cancelExecution, publishWorkflow } from '../store/slice';
import { ExecutionStatus, WorkflowStatus } from '../types';

const STATUS_LABEL: Record<WorkflowStatus, string> = {
  [WorkflowStatus.Draft]: 'Draft',
  [WorkflowStatus.Published]: 'Published',
  [WorkflowStatus.Archived]: 'Archived',
};

const EXECUTION_LABEL: Record<ExecutionStatus, string> = {
  [ExecutionStatus.Running]: 'Running',
  [ExecutionStatus.Completed]: 'Completed',
  [ExecutionStatus.Failed]: 'Failed',
  [ExecutionStatus.Cancelled]: 'Cancelled',
};

export function WorkflowPage() {
  const dispatch = useAppDispatch();
  const { workflows, executions, getCurrentStep } = useWorkflowModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workflow System</h1>
          <p className="text-sm text-muted-foreground">Manage approval workflows and track live executions.</p>
        </div>
        <Link
          href={`/${local}/workflow/new`}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm hover:bg-muted"
        >
          <Plus className="w-4 h-4" />
          New workflow
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">Workflow definitions</h2>
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.id} className="border rounded-md p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{wf.nameAr}</p>
                  <p className="text-xs text-muted-foreground">{wf.nameEn}</p>
                  <Link href={`/${local}/workflow/${wf.id}`} className="text-xs text-primary hover:underline">
                    View details
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted">{wf.type}</span>
                  <span className="text-xs">{STATUS_LABEL[wf.status]}</span>
                  <span className="text-xs text-muted-foreground">v{wf.version}</span>
                  {wf.status === WorkflowStatus.Draft && (
                    <button onClick={() => dispatch(publishWorkflow(wf.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                      Publish
                    </button>
                  )}
                  {wf.status === WorkflowStatus.Published && (
                    <button onClick={() => dispatch(archiveWorkflow(wf.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
                      Archive
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{wf.steps.length} steps</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">Live executions</h2>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No executions yet.</p>
        ) : (
          <ul className="space-y-2">
            {executions.map((exe) => {
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
                    <span className="text-xs">{EXECUTION_LABEL[exe.status]}</span>
                    {exe.status === ExecutionStatus.Running && (
                      <button onClick={() => dispatch(cancelExecution(exe.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">
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
