'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePermissionsModule } from '../hooks';

export function PermissionRoleDetailPage() {
  const { local, role } = useParams<{ local: string; role: string }>();
  const { permissions, getRoleByType, getUsersByRole } = usePermissionsModule();
  const roleEntity = getRoleByType(role);

  if (!roleEntity) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Role not found</h1>
        <p className="text-sm text-muted-foreground">This role type does not exist in current permissions data.</p>
        <Link href={`/${local}/permissions`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to permissions
        </Link>
      </div>
    );
  }

  const assignedUsers = getUsersByRole(roleEntity.type);
  const rolePermissions = permissions.filter((p) => roleEntity.permissions.includes(p.key));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Role view: {roleEntity.name}</h1>
          <p className="text-sm text-muted-foreground">Focused route for role members and effective permissions.</p>
        </div>
        <Link href={`/${local}/permissions`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to permissions
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Assigned users</h2>
        {assignedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users currently assigned to this role.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {assignedUsers.map((u) => (
              <li key={u.id} className="border rounded-md p-2">{u.fullName} - {u.email}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Role permissions</h2>
        {rolePermissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No permissions assigned to this role.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {rolePermissions.map((p) => (
              <li key={p.id} className="border rounded-md p-2">{p.label} <span className="text-muted-foreground">({p.key})</span></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
