import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { AssigneeType, ExecutionStatus, WorkflowStatus, WorkflowType } from '../types';

export type SlaAlert = {
  executionId:  string;
  workflowId:   string;
  workflowName: string;
  stepName:     string;
  kind:         'BREACHED' | 'APPROACHING';
  elapsedHours: number;
  slaHours:     number;
};

export function useWorkflowModule() {
  const state = useAppSelector((s) => s.workflows);
  const currentUser = useAppSelector((s) => s.auth.user);

  return useMemo(() => {
    const nowMs = Date.now();

    // SLA alerts — elapsed computed from currentStepStartedAt for accuracy
    const slaAlerts = state.executions.flatMap<SlaAlert>((exe) => {
      if (exe.status !== ExecutionStatus.Running || !exe.currentStepId) return [];
      const wf   = state.definitions.find((w) => w.id === exe.wfId);
      const step = wf?.steps.find((s) => s.id === exe.currentStepId);
      if (!wf || !step?.slaHours) return [];

      const startMs     = new Date(exe.currentStepStartedAt ?? exe.startedAt).getTime();
      const elapsedHours = (nowMs - startMs) / 3_600_000;
      const threshold    = step.slaHours;

      if (elapsedHours >= threshold) {
        return [{ executionId: exe.id, workflowId: wf.id, workflowName: wf.nameEn, stepName: step.nameEn, kind: 'BREACHED', elapsedHours: Math.round(elapsedHours * 10) / 10, slaHours: threshold }];
      }
      if (elapsedHours >= threshold * 0.8) {
        return [{ executionId: exe.id, workflowId: wf.id, workflowName: wf.nameEn, stepName: step.nameEn, kind: 'APPROACHING', elapsedHours: Math.round(elapsedHours * 10) / 10, slaHours: threshold }];
      }
      return [];
    });

    // Tasks pending for the current user — matches by ROLE, USER id, or DEPARTMENT
    const getPendingTasksForUser = (userId: string, roleId: string, deptIds: string[]) =>
      state.executions.flatMap((exe) => {
        if (exe.status !== ExecutionStatus.Running || !exe.currentStepId) return [];
        const wf   = state.definitions.find((w) => w.id === exe.wfId);
        const step = wf?.steps.find((s) => s.id === exe.currentStepId);
        if (!wf || !step) return [];

        const isAssigned =
          (step.assigneeType === AssigneeType.Role       && step.assigneeId === roleId) ||
          (step.assigneeType === AssigneeType.User       && step.assigneeId === userId) ||
          (step.assigneeType === AssigneeType.Department && deptIds.includes(step.assigneeId ?? ''));

        if (!isAssigned) return [];
        return [{ exe, wf, step }];
      });

    // All versions of the same workflow family (linked by parentId chain)
    const getVersionHistory = (workflowId: string) => {
      const target = state.definitions.find((w) => w.id === workflowId);
      if (!target) return [];
      const family = new Set<string>();
      // walk backwards through parentId chain to find root
      let cur: typeof target | undefined = target;
      while (cur) {
        family.add(cur.id);
        cur = cur.parentId ? state.definitions.find((w) => w.id === cur!.parentId) : undefined;
      }
      // collect all definitions that are descendants of the same root
      const rootId = [...family].at(-1)!;
      const descendants = (id: string): string[] => {
        const children = state.definitions.filter((w) => w.parentId === id).map((w) => w.id);
        return [id, ...children.flatMap(descendants)];
      };
      const allIds = new Set(descendants(rootId));
      return state.definitions
        .filter((w) => allIds.has(w.id))
        .sort((a, b) => b.version - a.version);
    };

    // Executions that target a specific entity (e.g. a record, lending request)
    const getExecutionsByEntityId = (entityId: string) =>
      state.executions.filter((e) => e.entityId === entityId);

    // Executions whose current step has breached SLA
    const getSlaBreachedExecutions = () =>
      slaAlerts.filter((a) => a.kind === 'BREACHED').map((a) => a.executionId);

    return {
      workflows:  state.definitions,
      executions: state.executions,
      slaAlerts,
      currentUser,

      // Core lookups
      getWorkflowById:         (id: string) => state.definitions.find((wf) => wf.id === id) ?? null,
      getExecutionsByWorkflowId: (wfId: string) => state.executions.filter((e) => e.wfId === wfId),
      getExecutionById:        (id: string) => state.executions.find((e) => e.id === id) ?? null,

      // Filtered lists
      getWorkflowsByType:  (type: WorkflowType) => state.definitions.filter((wf) => wf.type === type),
      getPublishedWorkflows: () => state.definitions.filter((wf) => wf.status === WorkflowStatus.Published),
      getDraftWorkflows:   () => state.definitions.filter((wf) => wf.status === WorkflowStatus.Draft),
      getRunningExecutions: () => state.executions.filter((e) => e.status === ExecutionStatus.Running),

      // Step lookups
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

      // New Phase 6 helpers
      getPendingTasksForUser,
      getVersionHistory,
      getExecutionsByEntityId,
      getSlaBreachedExecutions,
    };
  }, [state, currentUser]);
}
