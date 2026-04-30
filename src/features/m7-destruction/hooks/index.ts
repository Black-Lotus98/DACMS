import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DestructionStatus } from '../types';

const EXPIRY_WARNING_DAYS = 90;

export function useDestructionModule() {
  const state   = useAppSelector((s) => s.destruction);
  const records = useAppSelector((s) => s.records.items);

  return useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const warningDate = new Date(Date.now() + EXPIRY_WARNING_DAYS * 86_400_000)
      .toISOString().slice(0, 10);

    return {
      requests:         state.requests,
      items:            state.items,
      migrations:       state.migrations,

      pendingRequests:  state.requests.filter((r) => r.status === DestructionStatus.Pending),
      rejectedRequests: state.requests.filter((r) => r.status === DestructionStatus.Rejected),
      watchlistRequests: state.requests.filter(
        (r) => r.status === DestructionStatus.Pending || r.status === DestructionStatus.LegalReview
      ),

      getRequestById: (id: string) =>
        state.requests.find((r) => r.id === id) ?? null,

      getItemsByRequestId: (requestId: string) =>
        state.items.filter((i) => i.requestId === requestId),

      getExpiringSoon: () =>
        records.filter(
          (r) => r.retentionEnd >= today && r.retentionEnd <= warningDate
        ),

      getOverdueRecords: () =>
        records.filter((r) => r.retentionEnd < today),
    };
  }, [state, records]);
}
