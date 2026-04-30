'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import {
  addAccessLog,
  addUser,
  assignPermissionGroupToRole,
  assignPermissionGroupToUser,
  setUserRoles,
  toggleUserActive,
  upsertLocationAccessRule,
} from '../store/slice';
import { usePermissionsModule } from '../hooks';
import { ClearanceLevel, RoleAssignmentType, type UserEntity } from '../types';

const CLEARANCE_COLOR: Record<ClearanceLevel, string> = {
  [ClearanceLevel.TopSecret]:   'bg-red-100 text-red-800',
  [ClearanceLevel.Confidential]:'bg-orange-100 text-orange-800',
  [ClearanceLevel.Restricted]:  'bg-yellow-100 text-yellow-800',
  [ClearanceLevel.Public]:      'bg-green-100 text-green-800',
};

const ASSIGNMENT_LABELS: Record<RoleAssignmentType, string> = {
  [RoleAssignmentType.OnePerOrg]:  '1 / org',
  [RoleAssignmentType.OnePerDept]: '1 / dept',
  [RoleAssignmentType.MultiUser]:  'multi-user',
};

type Tab = 'users' | 'roles' | 'groups' | 'logs';

export function PermissionsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { users, roles, permissions, permissionGroups, accessLogs, getUsersByRole, locationAccessRules, ldapConfig } = usePermissionsModule();
  const [tab, setTab] = useState<Tab>('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [userError, setUserError] = useState('');

  // add-user form state
  const [form, setForm] = useState({
    username: '', nameAr: '', nameEn: '', email: '',
    deptId: '', branchId: '',
    clearanceLevel: ClearanceLevel.Restricted as ClearanceLevel,
    roleIds: [] as string[],
  });

  function handleAddUser() {
    if (!form.username || !form.nameEn || !form.email || form.roleIds.length === 0) return;
    const usernameExists = users.some((u) => u.username.toLowerCase() === form.username.trim().toLowerCase());
    const emailExists = users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase());
    if (usernameExists || emailExists) {
      setUserError(usernameExists ? 'Username already exists.' : 'Email already exists.');
      return;
    }
    setUserError('');
    const temporaryPassword = `Tmp#${Math.random().toString(36).slice(2, 8)}A1`;
    const newUser: UserEntity = {
      id: `u-${Date.now()}`,
      ...form,
      deptId:   form.deptId   || undefined,
      branchId: form.branchId || undefined,
      isActive: true,
      temporaryPassword,
      mustChangePassword: true,
      welcomeEmailSentAt: new Date().toISOString(),
      departmentFolderIds: form.deptId ? [`folder-${form.deptId}`] : [],
      authSource: ldapConfig.enabled ? 'LDAP' : 'LOCAL',
    };
    dispatch(addUser(newUser));
    dispatch(addAccessLog({
      id: `al-${Date.now()}`,
      userId: 'u1',
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: newUser.id,
      timestamp: new Date().toISOString(),
    }));
    setForm({ username: '', nameAr: '', nameEn: '', email: '', deptId: '', branchId: '', clearanceLevel: ClearanceLevel.Restricted, roleIds: [] });
    setShowAddUser(false);
  }

  function toggleFormRole(roleId: string) {
    setForm((f) => ({
      ...f,
      roleIds: f.roleIds.includes(roleId) ? f.roleIds.filter((r) => r !== roleId) : [...f.roleIds, roleId],
    }));
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'users',  label: `Users (${users.length})` },
    { key: 'roles',  label: `Roles (${roles.length})` },
    { key: 'groups', label: `Permission Groups (${permissionGroups.length})` },
    { key: 'logs',   label: `Access Log (${accessLogs.length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Users & Permissions</h1>
          <p className="text-sm text-muted-foreground">M10 · RBAC, user accounts, access log, password policy.</p>
        </div>
        <Link href={`/${local}/permissions/policy`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Password Policy
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${tab === t.key ? 'border-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddUser((v) => !v)}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
            >
              {showAddUser ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {/* Add user form — F10.1 */}
          {showAddUser && (
            <section className="rounded-xl border bg-background p-4 space-y-4">
              <h2 className="font-semibold text-sm">New User · F10.1</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  { field: 'username', label: 'Username' },
                  { field: 'nameEn',   label: 'Full Name (EN)' },
                  { field: 'nameAr',   label: 'Full Name (AR)' },
                  { field: 'email',    label: 'Email' },
                  { field: 'deptId',   label: 'Department ID (optional)' },
                  { field: 'branchId', label: 'Branch ID (optional)' },
                ].map(({ field, label }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs text-muted-foreground">{label}</label>
                    <input
                      type="text"
                      value={(form as unknown as Record<string, string>)[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Clearance Level</label>
                  <select
                    value={form.clearanceLevel}
                    onChange={(e) => setForm((f) => ({ ...f, clearanceLevel: e.target.value as ClearanceLevel }))}
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  >
                    {Object.values(ClearanceLevel).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Roles (select one or more) — F10.2</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <label key={r.id} className="flex items-center gap-1.5 text-sm border rounded-md px-2 py-1 cursor-pointer hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={form.roleIds.includes(r.id)}
                        onChange={() => toggleFormRole(r.id)}
                      />
                      {r.nameEn}
                    </label>
                  ))}
                </div>
              </div>
              {userError && <p className="text-xs text-red-600">{userError}</p>}
              <button
                onClick={handleAddUser}
                disabled={!form.username || !form.nameEn || !form.email || form.roleIds.length === 0}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-40"
              >
                Create user
              </button>
            </section>
          )}

          {/* Users table */}
          <div className="rounded-xl border bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground text-xs">
                <th className="p-3">Name</th>
                <th className="p-3">Username / Email</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Clearance</th>
                <th className="p-3">Last Login</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={`border-b hover:bg-muted/40 ${!u.isActive ? 'opacity-50' : ''}`}>
                    <td className="p-3">
                      <p className="font-medium">{u.nameEn}</p>
                      <p className="text-xs text-muted-foreground">{u.nameAr}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-mono text-xs">{u.username}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roleIds.map((rid) => {
                          const role = roles.find((r) => r.id === rid);
                          return role ? (
                            <span key={rid} className="text-xs bg-muted px-1.5 py-0.5 rounded">{role.nameEn}</span>
                          ) : null;
                        })}
                      </div>
                      <select
                        value={u.roleIds[0] ?? ''}
                        onChange={(e) => {
                          if (!e.target.value) return;
                          dispatch(setUserRoles({ userId: u.id, roleIds: [e.target.value] }));
                          dispatch(addAccessLog({
                            id: `al-${Date.now()}`,
                            userId: 'u1',
                            action: 'REASSIGN_ROLE',
                            entityType: 'User',
                            entityId: u.id,
                            timestamp: new Date().toISOString(),
                          }));
                        }}
                        className="mt-1 h-7 rounded-md border px-2 text-xs"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.nameEn}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CLEARANCE_COLOR[u.clearanceLevel]}`}>
                        {u.clearanceLevel}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '—'}
                      {u.mustChangePassword && <p className="text-amber-700">Must change password</p>}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => dispatch(toggleUserActive(u.id))}
                        className="text-xs h-7 px-2 rounded-md border hover:bg-muted whitespace-nowrap"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Roles tab ── */}
      {tab === 'roles' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {roles.map((r) => (
              <div key={r.id} className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{r.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{r.nameAr}</p>
                  </div>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                    {ASSIGNMENT_LABELS[r.assignmentType]}
                  </span>
                </div>
                {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                <p className="text-xs text-muted-foreground">{r.permissionKeys.length} permissions · {getUsersByRole(r.id).length} users</p>
                <Link
                  href={`/${local}/permissions/role/${r.type}`}
                  className="text-xs text-primary hover:underline"
                >
                  Manage role →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Permission Groups tab — F10.3 ── */}
      {tab === 'groups' && (
        <div className="space-y-4">
          {permissionGroups.map((g) => (
            <div key={g.id} className="rounded-xl border bg-background p-4 space-y-3">
              <div>
                <p className="font-semibold">{g.nameEn}</p>
                <p className="text-xs text-muted-foreground">{g.nameAr}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.permissionKeys.map((key) => {
                  const perm = permissions.find((p) => p.permKey === key);
                  return (
                    <span key={key} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {perm?.labelEn ?? key}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Assignment (propagates through effective-permissions):</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button key={`${g.id}-${r.id}`} onClick={() => dispatch(assignPermissionGroupToRole({ roleId: r.id, groupId: g.id }))} className="h-7 px-2 rounded border hover:bg-muted">
                      Toggle role: {r.nameEn}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {users.slice(0, 3).map((u) => (
                    <button key={`${g.id}-${u.id}`} onClick={() => dispatch(assignPermissionGroupToUser({ userId: u.id, groupId: g.id }))} className="h-7 px-2 rounded border hover:bg-muted">
                      Toggle user: {u.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <section className="rounded-xl border bg-background p-4 space-y-2">
            <h3 className="font-semibold text-sm">Archive location access (F10.5)</h3>
            {locationAccessRules.map((rule) => (
              <p key={rule.id} className="text-xs border rounded p-2">
                {rule.scopeType} {rule.scopeId} · roles: {(rule.roleIds ?? []).join(', ') || '—'} · departments: {(rule.departmentIds ?? []).join(', ') || '—'}
              </p>
            ))}
            <button
              onClick={() => dispatch(upsertLocationAccessRule({
                id: `lar-${Date.now()}`,
                scopeType: 'ROOM',
                scopeId: 'R99',
                roleIds: ['r2'],
              }))}
              className="h-8 px-3 rounded border text-xs hover:bg-muted"
            >
              Add sample room rule
            </button>
          </section>
        </div>
      )}

      {/* ── Access Log tab — F10.6 ── */}
      {tab === 'logs' && (
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            LDAP/AD integration (F10.7 prototype): {ldapConfig.enabled ? 'Enabled' : 'Disabled'} {ldapConfig.serverUrl ? `· ${ldapConfig.serverUrl}` : ''}
          </div>
          <div className="rounded-xl border bg-background overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground text-xs">
              <th className="p-3">Timestamp</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Entity ID</th>
              <th className="p-3">IP Address</th>
            </tr></thead>
            <tbody>
              {accessLogs.map((log) => {
                const user = users.find((u) => u.id === log.userId);
                return (
                  <tr key={log.id} className="border-b hover:bg-muted/40">
                    <td className="p-3 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3">
                      <p className="text-xs font-medium">{user?.nameEn ?? log.userId}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{log.action}</span>
                    </td>
                    <td className="p-3 text-xs">{log.entityType}</td>
                    <td className="p-3 font-mono text-xs">{log.entityId}</td>
                    <td className="p-3 text-xs text-muted-foreground">{log.ipAddress ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
