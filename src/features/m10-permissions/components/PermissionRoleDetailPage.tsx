'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { toggleRolePermission } from '../store/slice';
import { usePermissionsModule } from '../hooks';
import { type RoleType, RoleAssignmentType } from '../types';

const ASSIGNMENT_LABELS: Record<RoleAssignmentType, string> = {
  [RoleAssignmentType.OnePerOrg]:  'One per organisation',
  [RoleAssignmentType.OnePerDept]: 'One per department',
  [RoleAssignmentType.MultiUser]:  'Multiple users allowed',
};

export function PermissionRoleDetailPage() {
  const dispatch = useAppDispatch();
  const { local, role } = useParams<{ local: string; role: string }>();
  const { permissions, getRoleByType, getUsersByRole, getPermissionsByModule } = usePermissionsModule();

  const roleEntity = getRoleByType(role as RoleType);

  if (!roleEntity) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Role not found</h1>
        <Link href={`/${local}/permissions`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to permissions
        </Link>
      </div>
    );
  }

  const assignedUsers   = getUsersByRole(roleEntity.id);
  const modules         = [...new Set(permissions.map((p) => p.module))];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{roleEntity.nameEn}</h1>
          <p className="text-sm text-muted-foreground">{roleEntity.nameAr}</p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{ASSIGNMENT_LABELS[roleEntity.assignmentType]}</span>
            <span className="text-xs text-muted-foreground">{roleEntity.permissionKeys.length} permissions</span>
          </div>
          {roleEntity.description && (
            <p className="text-sm text-muted-foreground pt-1">{roleEntity.description}</p>
          )}
        </div>
        <Link href={`/${local}/permissions`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to permissions
        </Link>
      </div>

      {/* Assigned users */}
      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Assigned Users ({assignedUsers.length})</h2>
        {assignedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users currently assigned to this role.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedUsers.map((u) => (
              <div key={u.id} className="border rounded-md px-3 py-2 text-sm">
                <p className="font-medium">{u.nameEn}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Permission matrix — grouped by module */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <h2 className="font-semibold text-sm">Permission Matrix — F10.2</h2>
        <p className="text-xs text-muted-foreground">Toggle permissions on/off. Changes take effect immediately.</p>
        <div className="space-y-4">
          {modules.map((mod) => {
            const modPerms = getPermissionsByModule(mod);
            return (
              <div key={mod} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{mod}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {modPerms.map((perm) => {
                    const checked = roleEntity.permissionKeys.includes(perm.permKey);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50 transition-colors ${checked ? 'border-primary/40 bg-primary/5' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => dispatch(toggleRolePermission({ roleId: roleEntity.id, permKey: perm.permKey }))}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-medium">{perm.labelEn}</p>
                          <p className="text-xs text-muted-foreground">{perm.labelAr}</p>
                          <p className="text-xs font-mono text-muted-foreground">{perm.permKey}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
