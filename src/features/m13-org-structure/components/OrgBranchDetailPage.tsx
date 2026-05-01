'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useOrgModule } from '../hooks';
import { OrgTree } from './OrgTree';

export function OrgBranchDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getBranchById, getBranchDepts, getRootDepts, departments } = useOrgModule();
  const users = useAppSelector((s) => s.permissions.users);

  const branch = getBranchById(id);

  if (!branch) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Branch not found</h1>
        <p className="text-sm text-muted-foreground">This branch id does not exist in the current organization data.</p>
        <Link href={`/${local}/org-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← Org Structure
        </Link>
      </div>
    );
  }

  const branchDepts   = getBranchDepts(branch.id);
  const rootDepts     = getRootDepts(branch.id);
  const withResponsible = branchDepts.filter((d) => d.assigneeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{branch.nameEn}</h1>
          <p className="text-sm text-muted-foreground">
            {branch.nameAr} · {branch.code}
            {' · '}
            <span className={branch.isActive ? 'text-green-600' : 'text-destructive'}>
              {branch.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>
        <Link href={`/${local}/org-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted shrink-0">
          ← Org Structure
        </Link>
      </div>

      {/* Department hierarchy tree */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Department Hierarchy ({branchDepts.length} department{branchDepts.length !== 1 ? 's' : ''})
        </h2>
        <OrgTree
          branchName={branch.nameEn}
          branchNameAr={branch.nameAr}
          branchCode={branch.code}
          rootDepts={rootDepts}
          allDepts={departments}
        />
      </section>

      {/* Responsible users (F13.6) */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Department Responsible Users (F13.6)
        </h2>
        {withResponsible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No responsible users assigned in this branch.</p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Department</th>
                  <th className="text-left px-4 py-2 font-medium">Arabic Name</th>
                  <th className="text-left px-4 py-2 font-medium">Responsible User</th>
                  <th className="text-left px-4 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {withResponsible.map((dept) => {
                  const user = users.find((u) => u.id === dept.assigneeId);
                  return (
                    <tr key={dept.id} className="border-t">
                      <td className="px-4 py-2">{dept.nameEn}</td>
                      <td className="px-4 py-2 text-muted-foreground">{dept.nameAr}</td>
                      <td className="px-4 py-2">{user?.nameEn ?? dept.assigneeId}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {dept.responsibleEmail ?? user?.email ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Flat department list */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          All Departments
        </h2>
        {branchDepts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No departments assigned to this branch.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {branchDepts.map((dept) => (
              <div key={dept.id} className="rounded-lg border p-3 text-sm space-y-0.5">
                <p className="font-medium">{dept.nameEn}</p>
                <p className="text-muted-foreground">{dept.nameAr}</p>
                <p className="text-xs text-muted-foreground font-mono">{dept.code}</p>
                {dept.parentDeptId && (
                  <p className="text-xs text-muted-foreground">
                    Sub-department of: {branchDepts.find((d) => d.id === dept.parentDeptId)?.nameEn ?? dept.parentDeptId}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
