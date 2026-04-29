import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function usePermissionsModule() {
  const state = useAppSelector((s) => s.permissions);

  return useMemo(() => ({
    users: state.users,
    roles: state.roles,
    permissions: state.permissions,
    accessLogs: state.accessLogs,
    getRoleByType: (type: string) => state.roles.find((role) => role.type === type) ?? null,
    getUsersByRole: (type: string) => state.users.filter((user) => user.role === type),
  }), [state]);
}
