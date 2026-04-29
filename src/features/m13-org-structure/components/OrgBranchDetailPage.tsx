'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useOrgModule } from '../hooks';

export function OrgBranchDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getBranchById, getBranchDepts } = useOrgModule();

  const branch = getBranchById(id);

  if (!branch) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Branch not found</h1>
        <p className="text-sm text-muted-foreground">This branch id does not exist in current organization data.</p>
        <Link href={`/${local}/org-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to org structure
        </Link>
      </div>
    );
  }

  const departments = getBranchDepts(branch.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Branch view: {branch.name}</h1>
          <p className="text-sm text-muted-foreground">Code: {branch.code}</p>
        </div>
        <Link href={`/${local}/org-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to org structure
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Departments in this branch</h2>
        {departments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No departments are assigned to this branch.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {departments.map((dept) => (
              <li key={dept.id} className="border rounded-md p-2">
                <div className="font-medium">{dept.name}</div>
                <div className="text-muted-foreground">{dept.code}</div>
                <div className="text-xs text-muted-foreground">Responsible: {dept.responsibleEmail ?? 'Unassigned'}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
