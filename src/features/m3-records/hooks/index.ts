import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ClearanceLevel } from '@/config/roles';
import { SecrecyLevel } from '../types';

const CLEARANCE_RANK: Record<ClearanceLevel, number> = {
  [ClearanceLevel.Public]:      0,
  [ClearanceLevel.Restricted]:  1,
  [ClearanceLevel.Confidential]: 2,
  [ClearanceLevel.TopSecret]:   3,
};

const SECRECY_RANK: Record<SecrecyLevel, number> = {
  [SecrecyLevel.Public]:    0,
  [SecrecyLevel.Internal]:  1,
  [SecrecyLevel.Secret]:    2,
  [SecrecyLevel.TopSecret]: 3,
};

export function useRecordsModule() {
  const state = useAppSelector((s) => s.records);
  const userClearance = useAppSelector((s) => s.auth.clearanceLevel);

  return useMemo(() => {
    const canSee = (secrecy: SecrecyLevel) => {
      if (!userClearance) return false;
      return SECRECY_RANK[secrecy] <= CLEARANCE_RANK[userClearance];
    };

    const visibleRecords = state.items.filter((r) => canSee(r.secrecy));

    return {
      records: visibleRecords,
      files: state.files,

      history: state.locationHistory.filter((h) => {
        const rec = state.items.find((item) => item.id === h.recordId);
        return rec ? canSee(rec.secrecy) : false;
      }),

      getRecordById: (id: string) => {
        const rec = state.items.find((r) => r.id === id);
        return rec && canSee(rec.secrecy) ? rec : undefined;
      },

      getHistoryForRecord: (recordId: string) => {
        const rec = state.items.find((item) => item.id === recordId);
        if (!rec || !canSee(rec.secrecy)) return [];
        return state.locationHistory.filter((h) => h.recordId === recordId);
      },

      getFilesForRecord: (recordId: string) =>
        state.files.filter((f) => f.recordId === recordId),

      getRecordsByBox: (boxId: string) =>
        visibleRecords.filter((r) => r.boxId === boxId),

      getRecordsByDocType: (docTypeId: string) =>
        visibleRecords.filter((r) => r.docTypeId === docTypeId),
    };
  }, [state, userClearance]);
}
