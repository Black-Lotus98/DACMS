import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useBarcodesModule() {
  const state = useAppSelector((s) => s.barcodes);
  return useMemo(() => ({ labels: state.labels, printJobs: state.printJobs }), [state]);
}
