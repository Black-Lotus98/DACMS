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
    locationAccessRules: state.locationAccessRules,
    ldapConfig: state.ldapConfig,

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
        (role?.permissionGroupIds ?? []).forEach((gid) => {
          const group = state.permissionGroups.find((g) => g.id === gid);
          group?.permissionKeys.forEach((k) => keys.add(k));
        });
      });
      (user.permissionGroupIds ?? []).forEach((gid) => {
        const group = state.permissionGroups.find((g) => g.id === gid);
        group?.permissionKeys.forEach((k) => keys.add(k));
      });
      return Array.from(keys);
    },
    canAccessLocation: (
      userId: string,
      scopeType: 'ROOM' | 'SHELF',
      scopeId: string,
      departmentId?: string
    ) => {
      const user = state.users.find((u) => u.id === userId);
      if (!user) return false;
      const rules = state.locationAccessRules.filter(
        (r) => r.scopeType === scopeType && r.scopeId === scopeId
      );
      if (rules.length === 0) return true;
      return rules.some((r) => {
        const roleMatch = (r.roleIds ?? []).some((rid) => user.roleIds.includes(rid));
        const deptMatch = !!departmentId && (r.departmentIds ?? []).includes(departmentId);
        return roleMatch || deptMatch;
      });
    },
  }), [state]);
}
