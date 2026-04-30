import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LendingStatus } from '../types';

export function useLendingModule() {
  const state = useAppSelector((s) => s.lending);

  return useMemo(() => ({
    requests:        state.requests,
    items:           state.items,
    dispatches:      state.dispatches,

    overdueRequests: state.requests.filter((r) => r.status === LendingStatus.Overdue),
    activeRequests:  state.requests.filter(
      (r) => r.status === LendingStatus.Active || r.status === LendingStatus.Dispatched
    ),

    getRequestById: (id: string) =>
      state.requests.find((r) => r.id === id) ?? null,

    getItemsByRequestId: (requestId: string) =>
      state.items.filter((i) => i.requestId === requestId),

    getDispatchesByRequestId: (requestId: string) =>
      state.dispatches.filter((d) => d.requestId === requestId),
  }), [state]);
}
