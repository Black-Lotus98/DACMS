import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ExecutionStatus, WorkflowStatus, WorkflowType } from '../types';

export type SlaAlert = {
  executionId: string;
  workflowId:  string;
  workflowName: string;
  stepName:    string;
  kind:        'BREACHED' | 'APPROACHING';
  elapsedHours: number;
  slaHours:    number;
};

export function useWorkflowModule() {
  const state = useAppSelector((s) => s.workflows);

  return useMemo(() => {
    const nowMs = Date.now();
    const slaAlerts = state.executions.flatMap<SlaAlert>((exe) => {
      if (exe.status !== ExecutionStatus.Running || !exe.currentStepId) return [];
      const wf = state.definitions.find((w) => w.id === exe.wfId);
      const step = wf?.steps.find((s) => s.id === exe.currentStepId);
      if (!wf || !step?.slaHours) return [];
      const elapsedHours = (nowMs - new Date(exe.startedAt).getTime()) / 3_600_000;
      const threshold = step.slaHours;

      if (elapsedHours >= threshold) {
        return [{
          executionId: exe.id,
          workflowId: wf.id,
          workflowName: wf.nameEn,
          stepName: step.nameEn,
          kind: 'BREACHED' as const,
          elapsedHours: Math.round(elapsedHours * 10) / 10,
          slaHours: threshold,
        }];
      }
      if (elapsedHours >= threshold * 0.8) {
        return [{
          executionId: exe.id,
          workflowId: wf.id,
          workflowName: wf.nameEn,
          stepName: step.nameEn,
          kind: 'APPROACHING' as const,
          elapsedHours: Math.round(elapsedHours * 10) / 10,
          slaHours: threshold,
        }];
      }
      return [];
    });

    return {
      workflows: state.definitions,
      executions: state.executions,
      slaAlerts,

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
    };
  }, [state]);
}
