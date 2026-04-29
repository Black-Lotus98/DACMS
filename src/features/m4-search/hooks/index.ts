import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ClearanceLevel } from '@/config/roles';

const CLEARANCE_RANK: Record<ClearanceLevel, number> = {
  [ClearanceLevel.Public]: 0,
  [ClearanceLevel.Restricted]: 1,
  [ClearanceLevel.Confidential]: 2,
  [ClearanceLevel.TopSecret]: 3,
};

export function useSearchModule() {
  const state = useAppSelector((s) => s.search);
  const userClearance = useAppSelector((s) => s.auth.clearanceLevel);
  return useMemo(() => ({
    filters: state.filters,
    results: state.results.filter((r) => {
      if (!userClearance) return false;
      const required = CLEARANCE_RANK[r.secrecy as ClearanceLevel] ?? 0;
      return required <= CLEARANCE_RANK[userClearance];
    }),
    savedQueries: state.savedQueries,
    getSavedQueryById: (id: string) => state.savedQueries.find((q) => q.id === id) ?? null,
  }), [state, userClearance]);
}
