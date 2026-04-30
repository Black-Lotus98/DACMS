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
        (r) =>
          r.status === DestructionStatus.Pending ||
          r.status === DestructionStatus.SupervisorReview ||
          r.status === DestructionStatus.LegalReview ||
          r.status === DestructionStatus.DirectorReview
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

      getRetentionExpiryReport: () => {
        const ninetyDay = records.filter(
          (r) => r.retentionEnd >= today && r.retentionEnd <= warningDate
        );
        const byMonth: Record<string, number> = {};
        for (const rec of ninetyDay) {
          const month = rec.retentionEnd.slice(0, 7);
          byMonth[month] = (byMonth[month] ?? 0) + 1;
        }
        return {
          total: ninetyDay.length,
          byMonth,
        };
      },
    };
  }, [state, records]);
}
