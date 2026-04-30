import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { EntityType } from '../types';

export function useBarcodesModule() {
  const state = useAppSelector((s) => s.barcodes);

  return useMemo(() => ({
    labels:    state.labels,
    printJobs: state.printJobs,

    getActiveLabelByEntityId: (entityId: string) =>
      state.labels.find((l) => l.entityId === entityId && l.isActive) ?? null,

    getAllLabelsByEntityId: (entityId: string) =>
      state.labels.filter((l) => l.entityId === entityId),

    getLabelsByEntityType: (type: EntityType) =>
      state.labels.filter((l) => l.entityType === type && l.isActive),

    getPrintJobById: (id: string) => {
      const job = state.printJobs.find((j) => j.id === id) ?? null;
      if (!job) return null;
      return {
        ...job,
        labels: state.labels.filter((l) => job.labelIds.includes(l.id)),
      };
    },
  }), [state]);
}
