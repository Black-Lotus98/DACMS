'use client';

import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { WorkflowDesignerPage } from '@/features/m14-workflow/components/WorkflowDesignerPage';
import { WorkflowStatus } from '@/features/m14-workflow/types';
import { RoleType } from '@/config/roles';
import Link from 'next/link';

export default function EditWorkflowPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const role     = useAppSelector((s) => s.auth.role);
  const workflow = useAppSelector((s) =>
    s.workflows.definitions.find((w) => w.id === id),
  );

  if (role !== RoleType.Admin) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground">Only System Administrators can edit workflows.</p>
        <Link href={`/${local}/workflow/${id}`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← View workflow
        </Link>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Workflow not found</h1>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← Back to workflows
        </Link>
      </div>
    );
  }

  if (workflow.status !== WorkflowStatus.Draft) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Cannot edit a non-Draft workflow</h1>
        <p className="text-sm text-muted-foreground">
          Only Draft workflows can be edited. Use &ldquo;New version&rdquo; to create a Draft from a Published workflow.
        </p>
        <Link href={`/${local}/workflow/${id}`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← View workflow
        </Link>
      </div>
    );
  }

  return <WorkflowDesignerPage existingWorkflow={workflow} />;
}
