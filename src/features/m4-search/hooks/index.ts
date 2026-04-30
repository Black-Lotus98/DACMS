import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ClearanceLevel } from '@/config/roles';
import { SecrecyLevel } from '@/features/m3-records/types';
import type { SearchResult } from '../types';

const CLEARANCE_RANK: Record<ClearanceLevel, number> = {
  [ClearanceLevel.Public]:       0,
  [ClearanceLevel.Restricted]:   1,
  [ClearanceLevel.Confidential]: 2,
  [ClearanceLevel.TopSecret]:    3,
};

const SECRECY_RANK: Record<SecrecyLevel, number> = {
  [SecrecyLevel.Public]:    0,
  [SecrecyLevel.Internal]:  1,
  [SecrecyLevel.Secret]:    2,
  [SecrecyLevel.TopSecret]: 3,
};

export function useSearchModule() {
  const state         = useAppSelector((s) => s.search);
  const userClearance = useAppSelector((s) => s.auth.clearanceLevel);
  const m1            = useAppSelector((s) => s.archiveStructure);

  return useMemo(() => {
    const canSee = (result: SearchResult) => {
      if (!userClearance) return false;
      return SECRECY_RANK[result.secrecy] <= CLEARANCE_RANK[userClearance];
    };

    const visibleResults = state.results.filter(canSee);

    const applyFilters = (results: SearchResult[]) => {
      const f = state.filters;
      return results.filter((r) => {
        if (f.query) {
          const q = f.query.toLowerCase();
          if (
            !r.titleEn.toLowerCase().includes(q) &&
            !r.titleAr.includes(f.query) &&
            !r.refNo.toLowerCase().includes(q)
          ) return false;
        }
        if (f.docTypeId  && r.docTypeId  !== f.docTypeId)  return false;
        if (f.categoryId && r.categoryId !== f.categoryId) return false;
        if (f.status     && r.status     !== f.status)     return false;
        if (f.secrecy    && r.secrecy    !== f.secrecy)    return false;
        if (f.dateFrom   && r.archiveDate < f.dateFrom)    return false;
        if (f.dateTo     && r.archiveDate > f.dateTo)      return false;
        return true;
      });
    };

    const getLocationPath = (boxId: string): string => {
      const box   = m1.boxes.find((b) => b.id === boxId);
      if (!box) return boxId;
      const shelf = m1.shelves.find((s) => s.id === box.shelfId);
      if (!shelf) return `${boxId}`;
      const cab   = m1.cabinets.find((c) => c.id === shelf.cabinetId);
      if (!cab) return `${shelf.code} › ${box.label}`;
      const row   = m1.rows.find((r) => r.id === cab.rowId);
      if (!row) return `${cab.code} › ${shelf.code} › ${box.label}`;
      const room  = m1.rooms.find((r) => r.id === row.roomId);
      const parts = [room?.nameEn ?? row.roomId, `Row ${row.position}`, cab.code, shelf.code, box.label];
      return parts.join(' › ');
    };

    const searchByBarcode = (barcode: string) =>
      visibleResults.find((r) => r.refNo === barcode || r.id === barcode) ?? null;

    const getProximityResults = (boxId: string) => {
      const box = m1.boxes.find((b) => b.id === boxId);
      if (!box) return [];
      return visibleResults.filter((r) => r.boxId === box.shelfId || r.boxId === boxId);
    };

    return {
      filters:       state.filters,
      barcodeQuery:  state.barcodeQuery,
      results:       applyFilters(visibleResults),
      allResults:    visibleResults,
      savedQueries:  state.savedQueries,

      getSavedQueryById: (id: string) =>
        state.savedQueries.find((q) => q.id === id) ?? null,

      getLocationPath,
      searchByBarcode,
      getProximityResults,
    };
  }, [state, userClearance, m1]);
}
