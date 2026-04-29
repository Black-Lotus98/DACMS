import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useLendingModule() {
  const state = useAppSelector((s) => s.lending);
  return useMemo(() => ({
    requests: state.requests,
    dispatches: state.dispatches,
    getRequestById: (id: string) => state.requests.find((r) => r.id === id),
  }), [state]);
}
