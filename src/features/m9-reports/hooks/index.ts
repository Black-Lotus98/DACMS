import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
export function useReportsModule() {
  const state = useAppSelector((s) => s.reports);
  return useMemo(() => ({
    definitions: state.definitions,
    activeReportId: state.activeReportId,
    getReportById: (id: string) => state.definitions.find((r) => r.id === id) ?? null,
  }), [state]);
}
