'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWorkflowModule } from '../hooks';

export function WorkflowDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getWorkflowById, getExecutionsByWorkflowId } = useWorkflowModule();
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Workflow not found</h1>
        <p className="text-sm text-muted-foreground">This workflow id does not exist.</p>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to workflow
        </Link>
      </div>
    );
  }

  const executions = getExecutionsByWorkflowId(workflow.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Workflow view: {workflow.name}</h1>
          <p className="text-sm text-muted-foreground">Status: {workflow.status}</p>
        </div>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to workflow
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Workflow steps</h2>
        <ul className="space-y-2 text-sm">
          {workflow.steps.map((step) => (
            <li key={step.id} className="border rounded-md p-2">
              <div className="font-medium">{step.order}. {step.name}</div>
              <div className="text-xs text-muted-foreground">{step.type} - SLA {step.slaHours}h</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Executions</h2>
        {executions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No execution instances for this workflow yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {executions.map((execution) => (
              <li key={execution.id} className="border rounded-md p-2">{execution.id} - step {execution.currentStep} - {execution.status}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
