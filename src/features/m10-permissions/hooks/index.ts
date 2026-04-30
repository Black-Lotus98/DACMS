import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { RoleType } from '../types';

export function usePermissionsModule() {
  const state = useAppSelector((s) => s.permissions);

  return useMemo(() => ({
    users:            state.users,
    roles:            state.roles,
    permissions:      state.permissions,
    permissionGroups: state.permissionGroups,
    accessLogs:       state.accessLogs,
    passwordPolicy:   state.passwordPolicy,

    activeUsers:   state.users.filter((u) => u.isActive),
    inactiveUsers: state.users.filter((u) => !u.isActive),

    getUserById:   (id: string) => state.users.find((u) => u.id === id) ?? null,
    getRoleById:   (id: string) => state.roles.find((r) => r.id === id) ?? null,
    getRoleByType: (type: RoleType) => state.roles.find((r) => r.type === type) ?? null,

    getUsersByRole: (roleId: string) =>
      state.users.filter((u) => u.roleIds.includes(roleId)),

    getAccessLogsByUser: (userId: string) =>
      state.accessLogs.filter((l) => l.userId === userId),

    getPermissionsByModule: (module: string) =>
      state.permissions.filter((p) => p.module === module),

    getEffectivePermissions: (userId: string): string[] => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return [];
      const keys = new Set<string>();
      user.roleIds.forEach((rid) => {
        const role = state.roles.find((r) => r.id === rid);
        role?.permissionKeys.forEach((k) => keys.add(k));
      });
      return Array.from(keys);
    },
  }), [state]);
}
