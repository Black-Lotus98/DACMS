import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
export function useReportsModule() {
  const state = useAppSelector((s) => s.reports);
  return useMemo(() => ({ definitions: state.definitions, activeReportId: state.activeReportId }), [state]);
}
