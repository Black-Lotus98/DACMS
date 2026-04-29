import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useDestructionModule() {
  const state = useAppSelector((s) => s.destruction);
  return useMemo(() => ({
    requests: state.requests,
    migrations: state.migrations,
    getRequestById: (id: string) => state.requests.find((r) => r.id === id),
  }), [state]);
}
