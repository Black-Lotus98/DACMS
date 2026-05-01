'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { WorkflowDesignerPage } from '@/features/m14-workflow/components/WorkflowDesignerPage';
import { RoleType } from '@/config/roles';

export default function NewWorkflowPage() {
  const { local } = useParams<{ local: string }>();
  const role = useAppSelector((s) => s.auth.role);

  if (role !== RoleType.Admin) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground">Only System Administrators can create new workflows.</p>
        <Link href={`/${local}/workflow`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← Back to workflows
        </Link>
      </div>
    );
  }

  return <WorkflowDesignerPage />;
}
