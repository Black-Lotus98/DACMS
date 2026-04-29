import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function usePermissionsModule() {
  const state = useAppSelector((s) => s.permissions);

  return useMemo(() => ({
    users: state.users,
    roles: state.roles,
    permissions: state.permissions,
    accessLogs: state.accessLogs,
  }), [state]);
}
