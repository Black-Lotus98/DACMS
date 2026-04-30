import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ReportType } from '../types';

export function useReportsModule() {
  const state = useAppSelector((s) => s.reports);

  return useMemo(() => ({
    definitions:    state.definitions,
    activeReportId: state.activeReportId,
    activeReport:   state.definitions.find((r) => r.id === state.activeReportId) ?? null,
    getReportById:  (id: string) => state.definitions.find((r) => r.id === id) ?? null,
    getByType:      (type: ReportType) => state.definitions.filter((r) => r.type === type),
  }), [state]);
}
