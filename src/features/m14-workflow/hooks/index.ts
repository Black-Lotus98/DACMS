import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useWorkflowModule() {
  const state = useAppSelector((s) => s.workflows);
  return useMemo(() => ({
    workflows: state.definitions,
    executions: state.executions,
    getWorkflowById: (id: string) => state.definitions.find((wf) => wf.id === id) ?? null,
    getExecutionsByWorkflowId: (workflowId: string) =>
      state.executions.filter((execution) => execution.workflowId === workflowId),
  }), [state]);
}
