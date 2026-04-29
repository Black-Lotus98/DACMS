import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DestructionStatus } from '../types';

export function useDestructionModule() {
  const state = useAppSelector((s) => s.destruction);
  return useMemo(() => ({
    requests: state.requests,
    watchlistRequests: state.requests.filter((r) => r.status === DestructionStatus.Watchlist),
    migrations: state.migrations,
    getRequestById: (id: string) => state.requests.find((r) => r.id === id),
  }), [state]);
}
