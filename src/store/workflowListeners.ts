import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addRecord } from '@/features/m3-records/store/slice';
import { addRequest as addLendingRequest } from '@/features/m6-lending/store/slice';
import { addDestructionRequest } from '@/features/m7-destruction/store/slice';
import {
  addExecution,
  advanceExecution,
  escalateExecution,
} from '@/features/m14-workflow/store/slice';
import {
  AssigneeType,
  ExecutionStatus,
  StepType,
  WorkflowStatus,
  WorkflowType,
  type Workflow,
} from '@/features/m14-workflow/types';
import { createNotificationFromEvent } from '@/features/m8-notifications/store/slice';
import { NotificationType } from '@/features/m8-notifications/types';
import type { RootState } from './store';

export const workflowListenerMiddleware = createListenerMiddleware();
const startListening = workflowListenerMiddleware.startListening.withTypes<RootState>();

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function findPublishedWorkflow(state: RootState, type: WorkflowType): Workflow | null {
  return (
    state.workflows.definitions.find(
      (w) => w.type === type && w.status === WorkflowStatus.Published,
    ) ?? null
  );
}

function buildExecution(wfId: string, entityType: string, entityId: string) {
  const now = new Date().toISOString();
  return {
    id:                   `exe-${Date.now()}`,
    wfId,
    entityType,
    entityId,
    status:               ExecutionStatus.Running,
    startedAt:            now,
    actionHistory:        [] as [],
  };
}

// Resolve a user ID for an assignee so we can target notifications
function resolveAssigneeUserId(
  state: RootState,
  assigneeType: AssigneeType | undefined,
  assigneeId: string | undefined,
): string | null {
  if (!assigneeType || !assigneeId) return null;
  if (assigneeType === AssigneeType.User) return assigneeId;
  // For ROLE / DEPARTMENT, fall back to a mock user id keyed by role/dept
  // In a real system this would query the users list
  return `mock-${assigneeId}`;
}

// -------------------------------------------------------
// Check and auto-escalate SLA breaches across all running executions
// -------------------------------------------------------
function autoEscalateSlaBreaches(state: RootState, dispatch: (action: unknown) => void) {
  const nowMs = Date.now();
  for (const exe of state.workflows.executions) {
    if (exe.status !== ExecutionStatus.Running || !exe.currentStepId) continue;
    const wf   = state.workflows.definitions.find((w) => w.id === exe.wfId);
    const step = wf?.steps.find((s) => s.id === exe.currentStepId);
    if (!wf || !step?.slaHours) continue;

    const startMs      = new Date(exe.currentStepStartedAt ?? exe.startedAt).getTime();
    const elapsedHours = (nowMs - startMs) / 3_600_000;
    if (elapsedHours < step.slaHours) continue;

    // Auto-escalate to archive supervisor
    const escalateTo = 'mock-archive-supervisor';
    dispatch(escalateExecution({ executionId: exe.id, escalatedTo: escalateTo }));

    // Notify the supervisor
    dispatch(
      createNotificationFromEvent({
        id:        `notif-sla-${exe.id}-${Date.now()}`,
        userId:    escalateTo,
        type:      NotificationType.SlaBreach,
        titleEn:   'SLA Breached — Escalated to You',
        titleAr:   'تجاوز مهلة الخدمة — تم التصعيد إليك',
        bodyEn:    `Workflow "${wf.nameEn}" step "${step.nameEn}" exceeded ${step.slaHours}h SLA.`,
        bodyAr:    `تجاوزت خطوة "${step.nameAr}" في سير العمل "${wf.nameAr}" مهلة ${step.slaHours} ساعة.`,
        link:      `/workflow/executions`,
        createdAt: new Date().toISOString(),
      }),
    );
  }
}

// -------------------------------------------------------
// Notify new step assignee when advanceExecution fires
// -------------------------------------------------------
startListening({
  actionCreator: advanceExecution,
  effect: (_, { getState, dispatch }) => {
    const state = getState() as RootState;

    // Check SLA breaches on every advance (auto-escalation)
    autoEscalateSlaBreaches(state, dispatch);

    // Notify the assignee of every running execution's current step
    for (const exe of state.workflows.executions) {
      if (exe.status !== ExecutionStatus.Running || !exe.currentStepId) continue;
      const wf   = state.workflows.definitions.find((w) => w.id === exe.wfId);
      const step = wf?.steps.find((s) => s.id === exe.currentStepId);
      if (!wf || !step || step.stepType !== StepType.Human) continue;

      const assigneeUserId = resolveAssigneeUserId(
        state,
        step.assigneeType,
        step.assigneeId,
      );
      if (!assigneeUserId) continue;

      dispatch(
        createNotificationFromEvent({
          id:        `notif-task-${exe.id}-${step.id}-${Date.now()}`,
          userId:    assigneeUserId,
          type:      NotificationType.TaskAssigned,
          titleEn:   'New Workflow Task Assigned',
          titleAr:   'مهمة سير عمل جديدة',
          bodyEn:    `"${step.nameEn}" in "${wf.nameEn}" awaits your action.`,
          bodyAr:    `خطوة "${step.nameAr}" في سير العمل "${wf.nameAr}" تنتظر إجراءك.`,
          link:      `/workflow/my-tasks`,
          createdAt: new Date().toISOString(),
        }),
      );
    }
  },
});

// -------------------------------------------------------
// Auto-start executions from module events
// -------------------------------------------------------

// M3 → M14: new record triggers archiving workflow
startListening({
  actionCreator: addRecord,
  effect: (action, { getState, dispatch }) => {
    const state = getState() as RootState;
    const wf    = findPublishedWorkflow(state, WorkflowType.Archiving);
    if (!wf) return;

    const firstStep = wf.steps[0];
    const now       = new Date().toISOString();
    dispatch(
      addExecution({
        ...buildExecution(wf.id, 'RECORD', action.payload.id),
        currentStepId:        firstStep?.id,
        currentStepStartedAt: now,
      }),
    );
  },
});

// M6 → M14: new lending request triggers lending workflow
startListening({
  actionCreator: addLendingRequest,
  effect: (action, { getState, dispatch }) => {
    const state = getState() as RootState;
    const wf    = findPublishedWorkflow(state, WorkflowType.Lending);
    if (!wf) return;

    const firstStep = wf.steps[0];
    const now       = new Date().toISOString();
    dispatch(
      addExecution({
        ...buildExecution(wf.id, 'LENDING_REQUEST', action.payload.id),
        currentStepId:        firstStep?.id,
        currentStepStartedAt: now,
      }),
    );
  },
});

// M7 → M14: new destruction request triggers destruction workflow
startListening({
  actionCreator: addDestructionRequest,
  effect: (action, { getState, dispatch }) => {
    const state = getState() as RootState;
    const wf    = findPublishedWorkflow(state, WorkflowType.Destruction);
    if (!wf) return;

    const firstStep = wf.steps[0];
    const now       = new Date().toISOString();
    dispatch(
      addExecution({
        ...buildExecution(wf.id, 'DESTRUCTION_REQUEST', action.payload.id),
        currentStepId:        firstStep?.id,
        currentStepStartedAt: now,
      }),
    );
  },
});
