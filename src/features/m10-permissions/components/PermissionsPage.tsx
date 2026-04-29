'use client';

import { usePermissionsModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { setUserRole, toggleRolePermission } from '../store/slice';
import { ALL_ROLES, ROLE_LABELS, type RoleType } from '@/config/roles';

export function PermissionsPage() {
  const dispatch = useAppDispatch();
  const { users, roles, permissions, accessLogs } = usePermissionsModule();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users & Permissions</h1>
        <p className="text-sm text-muted-foreground">بداية وحدة M10: إدارة المستخدمين، الأدوار، وAccess log.</p>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">المستخدمون</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-start p-2">الاسم</th>
                <th className="text-start p-2">البريد</th>
                <th className="text-start p-2">الدور</th>
                <th className="text-start p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.fullName}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        dispatch(
                          setUserRole({
                            userId: u.id,
                            role: e.target.value as RoleType,
                          })
                        )
                      }
                      className="h-8 rounded-md border px-2 text-xs"
                    >
                      {ALL_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">{u.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold mb-3">الأدوار</h2>
          <ul className="space-y-2 text-sm">
            {roles.map((r) => (
              <li key={r.id} className="flex justify-between border rounded-md p-2">
                <span>{r.name}</span>
                <span className="text-muted-foreground">{r.permissions.length} permission</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold mb-3">Permission matrix</h2>
          <div className="space-y-3 mb-5">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-md p-2">
                <p className="font-medium text-sm mb-2">{role.name}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {permissions.map((perm) => {
                    const checked = role.permissions.includes(perm.key);
                    return (
                      <label key={`${role.id}-${perm.id}`} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            dispatch(
                              toggleRolePermission({
                                roleId: role.id,
                                permissionKey: perm.key,
                              })
                            )
                          }
                        />
                        <span>{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-semibold mb-3">Access log</h2>
          <ul className="space-y-2 text-sm">
            {accessLogs.map((log) => (
              <li key={log.id} className="border rounded-md p-2">
                <p className="font-medium">{log.action}</p>
                <p className="text-muted-foreground">{log.userEmail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
