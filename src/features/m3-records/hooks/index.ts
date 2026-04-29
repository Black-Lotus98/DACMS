import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ClearanceLevel } from '@/config/roles';
import { SecrecyLevel } from '../types';

const CLEARANCE_RANK: Record<ClearanceLevel, number> = {
  [ClearanceLevel.Public]: 0,
  [ClearanceLevel.Restricted]: 1,
  [ClearanceLevel.Confidential]: 2,
  [ClearanceLevel.TopSecret]: 3,
};

const SECRECY_RANK: Record<SecrecyLevel, number> = {
  [SecrecyLevel.Public]: 0,
  [SecrecyLevel.Restricted]: 1,
  [SecrecyLevel.Confidential]: 2,
  [SecrecyLevel.TopSecret]: 3,
};

export function useRecordsModule() {
  const state = useAppSelector((s) => s.records);
  const userClearance = useAppSelector((s) => s.auth.clearanceLevel);
  return useMemo(() => ({
    records: state.items.filter((r) => {
      if (!userClearance) return false;
      const required = SECRECY_RANK[r.secrecy] ?? 0;
      return required <= CLEARANCE_RANK[userClearance];
    }),
    history: state.locationHistory.filter((h) => {
      const rec = state.items.find((item) => item.id === h.recordId);
      if (!rec || !userClearance) return false;
      const required = SECRECY_RANK[rec.secrecy] ?? 0;
      return required <= CLEARANCE_RANK[userClearance];
    }),
    getRecordById: (id: string) =>
      state.items.find((r) => {
        if (r.id !== id || !userClearance) return false;
        const required = SECRECY_RANK[r.secrecy] ?? 0;
        return required <= CLEARANCE_RANK[userClearance];
      }),
    getHistoryForRecord: (recordId: string) => {
      const rec = state.items.find((item) => item.id === recordId);
      if (!rec || !userClearance) return [];
      const required = SECRECY_RANK[rec.secrecy] ?? 0;
      if (required > CLEARANCE_RANK[userClearance]) return [];
      return state.locationHistory.filter((h) => h.recordId === recordId);
    },
  }), [state, userClearance]);
}
