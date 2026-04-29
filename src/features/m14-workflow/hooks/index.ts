import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useWorkflowModule() {
  const state = useAppSelector((s) => s.workflows);
  return useMemo(() => ({
    workflows: state.definitions,
    executions: state.executions,
  }), [state]);
}
