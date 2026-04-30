import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LendingStatus } from '@/features/m6-lending/types';
import { RecordStatus } from '@/features/m3-records/types';
import { DestructionStatus } from '@/features/m7-destruction/types';
import { KpiGroup, KpiTrend } from '../types';
import type { KPIDefinition, KPISnapshot } from '../types';

export type KpiWithValue = KPIDefinition & {
  liveValue:   number;
  trend:       KpiTrend;
  trafficLight: 'green' | 'yellow' | 'red';
  snapshots:   KPISnapshot[];
};

export function useKpiModule() {
  const kpiState          = useAppSelector((s) => s.kpi);
  const kpiLinkingState   = useAppSelector((s) => s.kpiLinking);
  const archiveStructure  = useAppSelector((s) => s.archiveStructure);
  const lendingState      = useAppSelector((s) => s.lending);
  const recordsState      = useAppSelector((s) => s.records);
  const destructionState  = useAppSelector((s) => s.destruction);

  const liveValues = useMemo<Record<string, number>>(() => {
    const rooms   = archiveStructure.rooms;
    const shelves = archiveStructure.shelves;
    const lendingRequests   = lendingState.requests;
    const recordItems       = recordsState.items;
    const recordFiles       = recordsState.files;
    const destructionReqs   = destructionState.requests;
    const now = new Date();

    const totalRoomCap  = rooms.reduce((s, r) => s + r.capacity, 0);
    const totalRoomUsed = rooms.reduce((s, r) => s + r.currentUse, 0);

    const totalShelfCap  = shelves.reduce((s, sh) => s + sh.capacity, 0);
    const totalShelfUsed = shelves.reduce((s, sh) => s + sh.used, 0);

    const overdueRequests = lendingRequests.filter(
      (r) => r.dueDate && new Date(r.dueDate) < now &&
             r.status !== LendingStatus.Returned && r.status !== LendingStatus.Rejected,
    );
    const activeRequests = lendingRequests.filter(
      (r) => r.status !== LendingStatus.Returned && r.status !== LendingStatus.Rejected,
    );

    const returned = lendingRequests.filter((r) => r.returnedAt && r.approvedAt);
    const avgLendingDuration = returned.length > 0
      ? returned.reduce((s, r) => {
          const days = (new Date(r.returnedAt!).getTime() - new Date(r.approvedAt!).getTime()) / 86_400_000;
          return s + Math.abs(days);
        }, 0) / returned.length
      : 0;

    const recordsWithDates = recordItems.filter((r) => r.issueDate && r.archiveDate);
    const avgProcessing = recordsWithDates.length > 0
      ? recordsWithDates.reduce((s, r) => {
          const days = (new Date(r.archiveDate).getTime() - new Date(r.issueDate).getTime()) / 86_400_000;
          return s + Math.abs(days);
        }, 0) / recordsWithDates.length
      : 0;

    const recordsWithFiles = new Set(recordFiles.map((f) => f.recordId));
    const digitizedRate = recordItems.length > 0
      ? (recordsWithFiles.size / recordItems.length) * 100 : 0;

    const archivedCount = recordItems.filter((r) => r.status === RecordStatus.Archived).length;
    const archivedRate = recordItems.length > 0 ? (archivedCount / recordItems.length) * 100 : 0;

    const pendingDestruction = destructionReqs.filter((r) => r.status === DestructionStatus.Pending).length;
    const decidedDestruction = destructionReqs.filter(
      (r) => r.status === DestructionStatus.Approved ||
             r.status === DestructionStatus.Rejected  ||
             r.status === DestructionStatus.Executed,
    );
    const approvedDestruction = decidedDestruction.filter(
      (r) => r.status === DestructionStatus.Approved || r.status === DestructionStatus.Executed,
    );
    const destructionApprovalRate = decidedDestruction.length > 0
      ? (approvedDestruction.length / decidedDestruction.length) * 100 : 0;

    return {
      'kpi-op-1': totalRoomCap  > 0 ? (totalRoomUsed  / totalRoomCap)  * 100 : 0,
      'kpi-op-2': Math.round(digitizedRate * 10) / 10,
      'kpi-op-3': Math.round(avgProcessing * 10) / 10,
      'kpi-ln-1': Math.round(avgLendingDuration * 10) / 10,
      'kpi-ln-2': activeRequests.length > 0 ? Math.round((overdueRequests.length / activeRequests.length) * 1000) / 10 : 0,
      'kpi-ln-3': lendingRequests.length,
      'kpi-st-1': totalShelfCap > 0 ? Math.round((totalShelfUsed / totalShelfCap) * 1000) / 10 : 0,
      'kpi-st-2': Math.round(archivedRate * 10) / 10,
      'kpi-ds-1': pendingDestruction,
      'kpi-ds-2': Math.round(destructionApprovalRate * 10) / 10,
      'kpi-gv-1': overdueRequests.length,
      'kpi-gv-2': 72,
      'kpi-gv-3': 87,
    };
  }, [archiveStructure, lendingState, recordsState, destructionState]);

  const enriched = useMemo<KpiWithValue[]>(() => {
    return kpiState.definitions.map((def) => {
      const liveValue = liveValues[def.id] ?? 0;

      const defSnaps = kpiState.snapshots
        .filter((s) => s.kpiId === def.id)
        .sort((a, b) => a.period.localeCompare(b.period));

      const last2 = defSnaps.slice(-2);
      let trend: KpiTrend = KpiTrend.Stable;
      if (last2.length === 2) {
        const diff = last2[1].value - last2[0].value;
        if (Math.abs(diff) >= 1) trend = diff > 0 ? KpiTrend.Up : KpiTrend.Down;
      }

      let trafficLight: 'green' | 'yellow' | 'red' = 'green';
      if (def.targetValue !== undefined) {
        if (def.higherIsBetter) {
          if (liveValue >= def.targetValue)              trafficLight = 'green';
          else if (liveValue >= def.targetValue * 0.8)  trafficLight = 'yellow';
          else                                           trafficLight = 'red';
        } else {
          if (liveValue <= def.targetValue)              trafficLight = 'green';
          else if (liveValue <= def.targetValue * 1.2)  trafficLight = 'yellow';
          else                                           trafficLight = 'red';
        }
      }

      return { ...def, liveValue, trend, trafficLight, snapshots: defSnaps };
    });
  }, [kpiState.definitions, kpiState.snapshots, liveValues]);

  const mappings = kpiLinkingState.mappings;

  return useMemo(() => ({
    definitions:  kpiState.definitions,
    snapshots:    kpiState.snapshots,
    enriched,
    mappings,

    getById:        (id: string)   => enriched.find((k) => k.id === id) ?? null,
    getByKey:       (key: string)  => enriched.find((k) => k.key === key) ?? null,
    getByGroup:     (group: KpiGroup) => enriched.filter((k) => k.group === group),
    getKpisForRole: (role: string) => {
      const mapping = mappings.find((m) => m.role === role);
      if (!mapping) return [];
      const mapped = enriched.filter((k) => mapping.kpiKeys.includes(k.key));
      if (!mapping.displayOrder || mapping.displayOrder.length === 0) return mapped;
      const rank = new Map(mapping.displayOrder.map((k, i) => [k, i]));
      return [...mapped].sort((a, b) => (rank.get(a.key) ?? 999) - (rank.get(b.key) ?? 999));
    },
    getSnapshotsForKpi: (kpiId: string) =>
      kpiState.snapshots.filter((s) => s.kpiId === kpiId).sort((a, b) => a.period.localeCompare(b.period)),
  }), [kpiState.definitions, kpiState.snapshots, enriched, mappings]);
}
