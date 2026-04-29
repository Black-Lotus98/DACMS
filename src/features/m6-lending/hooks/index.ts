import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LendingStatus } from '../types';

export function useLendingModule() {
  const state = useAppSelector((s) => s.lending);
  return useMemo(() => ({
    requests: state.requests,
    overdueRequests: state.requests.filter((r) => r.status === LendingStatus.Overdue),
    dispatches: state.dispatches,
    getRequestById: (id: string) => state.requests.find((r) => r.id === id),
  }), [state]);
}
