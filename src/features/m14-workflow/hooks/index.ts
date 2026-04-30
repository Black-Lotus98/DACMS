import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ExecutionStatus, WorkflowStatus, WorkflowType } from '../types';

export function useWorkflowModule() {
  const state = useAppSelector((s) => s.workflows);

  return useMemo(() => ({
    workflows: state.definitions,
    executions: state.executions,

    // Lookups
    getWorkflowById: (id: string) =>
      state.definitions.find((wf) => wf.id === id) ?? null,
    getExecutionsByWorkflowId: (wfId: string) =>
      state.executions.filter((e) => e.wfId === wfId),
    getExecutionById: (id: string) =>
      state.executions.find((e) => e.id === id) ?? null,

    // Filtered lists
    getWorkflowsByType: (type: WorkflowType) =>
      state.definitions.filter((wf) => wf.type === type),
    getPublishedWorkflows: () =>
      state.definitions.filter((wf) => wf.status === WorkflowStatus.Published),
    getDraftWorkflows: () =>
      state.definitions.filter((wf) => wf.status === WorkflowStatus.Draft),
    getRunningExecutions: () =>
      state.executions.filter((e) => e.status === ExecutionStatus.Running),

    // Step lookup within a workflow
    getStepById: (wfId: string, stepId: string) => {
      const wf = state.definitions.find((w) => w.id === wfId);
      return wf?.steps.find((s) => s.id === stepId) ?? null;
    },
    getCurrentStep: (execId: string) => {
      const exe = state.executions.find((e) => e.id === execId);
      if (!exe?.currentStepId) return null;
      const wf = state.definitions.find((w) => w.id === exe.wfId);
      return wf?.steps.find((s) => s.id === exe.currentStepId) ?? null;
    },
  }), [state]);
}
