import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { executionsSeed, workflowsSeed } from '../data';
import {
  ExecutionStatus,
  StepType,
  WorkflowStatus,
  type StepActionRecord,
  type Workflow,
  type WorkflowEdge,
  type WorkflowExecution,
  type WorkflowStep,
  type WorkflowsState,
} from '../types';

const initialState: WorkflowsState = {
  definitions: workflowsSeed,
  executions:  executionsSeed,
};

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    // -------------------------------------------------------
    // Workflow definition CRUD
    // -------------------------------------------------------
    addWorkflow(state, action: PayloadAction<Workflow>) {
      state.definitions.unshift(action.payload);
    },

    updateWorkflow(state, action: PayloadAction<Workflow>) {
      const idx = state.definitions.findIndex((w) => w.id === action.payload.id);
      if (idx !== -1) state.definitions[idx] = action.payload;
    },

    deleteWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (!wf || wf.status !== WorkflowStatus.Draft) return;
      state.definitions = state.definitions.filter((w) => w.id !== action.payload);
    },

    // -------------------------------------------------------
    // Step management (used by designer)
    // -------------------------------------------------------
    addStep(state, action: PayloadAction<{ workflowId: string; step: WorkflowStep }>) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (wf && wf.status === WorkflowStatus.Draft) {
        wf.steps.push(action.payload.step);
      }
    },

    updateStep(state, action: PayloadAction<{ workflowId: string; step: WorkflowStep }>) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (!wf || wf.status !== WorkflowStatus.Draft) return;
      const idx = wf.steps.findIndex((s) => s.id === action.payload.step.id);
      if (idx !== -1) wf.steps[idx] = action.payload.step;
    },

    removeStep(state, action: PayloadAction<{ workflowId: string; stepId: string }>) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (!wf || wf.status !== WorkflowStatus.Draft) return;
      wf.steps = wf.steps.filter((s) => s.id !== action.payload.stepId);
      wf.edges = wf.edges.filter(
        (e) => e.source !== action.payload.stepId && e.target !== action.payload.stepId,
      );
    },

    addEdge(state, action: PayloadAction<{ workflowId: string; edge: WorkflowEdge }>) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (wf && wf.status === WorkflowStatus.Draft) {
        wf.edges.push(action.payload.edge);
      }
    },

    removeEdge(state, action: PayloadAction<{ workflowId: string; edgeId: string }>) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (wf && wf.status === WorkflowStatus.Draft) {
        wf.edges = wf.edges.filter((e) => e.id !== action.payload.edgeId);
      }
    },

    updateStepPositions(
      state,
      action: PayloadAction<{ workflowId: string; positions: { id: string; posX: number; posY: number }[] }>,
    ) {
      const wf = state.definitions.find((w) => w.id === action.payload.workflowId);
      if (!wf) return;
      for (const pos of action.payload.positions) {
        const step = wf.steps.find((s) => s.id === pos.id);
        if (step) { step.posX = pos.posX; step.posY = pos.posY; }
      }
    },

    // -------------------------------------------------------
    // F14.7: lifecycle transitions
    // -------------------------------------------------------
    publishWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (!wf || wf.status !== WorkflowStatus.Draft) return;
      state.definitions
        .filter((w) => w.type === wf.type && w.status === WorkflowStatus.Published)
        .forEach((w) => { w.status = WorkflowStatus.Archived; });
      wf.status = WorkflowStatus.Published;
    },

    archiveWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (wf) wf.status = WorkflowStatus.Archived;
    },

    createNewVersion(state, action: PayloadAction<string>) {
      const source = state.definitions.find((w) => w.id === action.payload);
      if (!source || source.status !== WorkflowStatus.Published) return;
      state.definitions.unshift({
        ...source,
        id:       `${source.id}-v${source.version + 1}`,
        version:  source.version + 1,
        status:   WorkflowStatus.Draft,
        parentId: source.id,
      });
    },

    // -------------------------------------------------------
    // Execution management
    // -------------------------------------------------------
    addExecution(state, action: PayloadAction<WorkflowExecution>) {
      state.executions.unshift(action.payload);
    },

    // F14.5 / F14.6: record action, follow edge-based branching, auto-advance System steps
    advanceExecution(
      state,
      action: PayloadAction<{ executionId: string; action: string; actorId: string; comment?: string }>,
    ) {
      const { executionId, action: act, actorId, comment } = action.payload;
      const exe = state.executions.find((e) => e.id === executionId);
      if (!exe || exe.status !== ExecutionStatus.Running) return;
      const wf = state.definitions.find((w) => w.id === exe.wfId);
      if (!wf || !exe.currentStepId) return;

      const record: StepActionRecord = {
        stepId:  exe.currentStepId,
        action:  act,
        actorId,
        takenAt: new Date().toISOString(),
        comment,
      };
      exe.actionHistory.push(record);

      // Find next step via edges: prefer edge whose label matches the action, else first edge
      const outgoing = wf.edges.filter((e) => e.source === exe.currentStepId);
      const matchedEdge = outgoing.find((e) => e.label === act) ?? outgoing[0];

      if (!matchedEdge) {
        exe.status      = ExecutionStatus.Completed;
        exe.completedAt = new Date().toISOString();
        exe.currentStepId = undefined;
        return;
      }

      const nextStep = wf.steps.find((s) => s.id === matchedEdge.target);
      if (!nextStep) {
        exe.status      = ExecutionStatus.Completed;
        exe.completedAt = new Date().toISOString();
        exe.currentStepId = undefined;
        return;
      }

      exe.currentStepId          = nextStep.id;
      exe.currentStepStartedAt   = new Date().toISOString();

      // Auto-advance through System steps
      let step = nextStep;
      while (step.stepType === StepType.System) {
        exe.actionHistory.push({
          stepId:  step.id,
          action:  'AutoComplete',
          actorId: 'system',
          takenAt: new Date().toISOString(),
        });
        const nextOutgoing = wf.edges.filter((e) => e.source === step.id);
        if (nextOutgoing.length === 0) {
          exe.status      = ExecutionStatus.Completed;
          exe.completedAt = new Date().toISOString();
          exe.currentStepId = undefined;
          return;
        }
        const nextNode = wf.steps.find((s) => s.id === nextOutgoing[0].target);
        if (!nextNode) {
          exe.status      = ExecutionStatus.Completed;
          exe.completedAt = new Date().toISOString();
          exe.currentStepId = undefined;
          return;
        }
        exe.currentStepId        = nextNode.id;
        exe.currentStepStartedAt = new Date().toISOString();
        step = nextNode;
      }
    },

    cancelExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (exe && exe.status === ExecutionStatus.Running) {
        exe.status      = ExecutionStatus.Cancelled;
        exe.completedAt = new Date().toISOString();
      }
    },

    failExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (exe && exe.status === ExecutionStatus.Running) {
        exe.status      = ExecutionStatus.Failed;
        exe.completedAt = new Date().toISOString();
      }
    },

    // F14.8: SLA breach escalation
    escalateExecution(
      state,
      action: PayloadAction<{ executionId: string; escalatedTo: string }>,
    ) {
      const exe = state.executions.find((e) => e.id === action.payload.executionId);
      if (exe && exe.status === ExecutionStatus.Running) {
        exe.status      = ExecutionStatus.Escalated;
        exe.escalatedTo = action.payload.escalatedTo;
      }
    },

    // Retry from a specific step (e.g. after escalation resolution)
    retryExecution(
      state,
      action: PayloadAction<{ executionId: string; fromStepId: string }>,
    ) {
      const exe = state.executions.find((e) => e.id === action.payload.executionId);
      if (!exe) return;
      exe.status                = ExecutionStatus.Running;
      exe.currentStepId         = action.payload.fromStepId;
      exe.currentStepStartedAt  = new Date().toISOString();
      exe.completedAt           = undefined;
      exe.escalatedTo           = undefined;
    },
  },
});

export const {
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addStep,
  updateStep,
  removeStep,
  addEdge,
  removeEdge,
  updateStepPositions,
  publishWorkflow,
  archiveWorkflow,
  createNewVersion,
  addExecution,
  advanceExecution,
  cancelExecution,
  failExecution,
  escalateExecution,
  retryExecution,
} = workflowsSlice.actions;

export default workflowsSlice.reducer;
