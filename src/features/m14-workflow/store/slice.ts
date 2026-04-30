import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { executionsSeed, workflowsSeed } from '../data';
import {
  ExecutionStatus,
  WorkflowStatus,
  type Workflow,
  type WorkflowExecution,
  type WorkflowsState,
} from '../types';

const initialState: WorkflowsState = {
  definitions: workflowsSeed,
  executions: executionsSeed,
};

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    // --- Workflow definitions ---
    addWorkflow(state, action: PayloadAction<Workflow>) {
      state.definitions.unshift(action.payload);
    },

    // F14.7: DRAFT → PUBLISHED → ARCHIVED; only one PUBLISHED per workflow type at a time
    publishWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (!wf || wf.status === WorkflowStatus.Archived) return;
      state.definitions
        .filter((w) => w.type === wf.type && w.status === WorkflowStatus.Published)
        .forEach((w) => { w.status = WorkflowStatus.Archived; });
      wf.status = WorkflowStatus.Published;
    },

    archiveWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (wf) wf.status = WorkflowStatus.Archived;
    },

    // Creates a new DRAFT version of an existing published workflow (F14.7)
    createNewVersion(state, action: PayloadAction<string>) {
      const source = state.definitions.find((w) => w.id === action.payload);
      if (!source) return;
      state.definitions.unshift({
        ...source,
        id: `${source.id}-v${source.version + 1}`,
        version: source.version + 1,
        status: WorkflowStatus.Draft,
      });
    },

    // --- Executions ---
    addExecution(state, action: PayloadAction<WorkflowExecution>) {
      state.executions.unshift(action.payload);
    },

    advanceExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (!exe || exe.status !== ExecutionStatus.Running) return;
      const wf = state.definitions.find((w) => w.id === exe.wfId);
      if (!wf) return;

      const currentIdx = wf.steps.findIndex((s) => s.id === exe.currentStepId);
      const nextStep = wf.steps[currentIdx + 1];

      if (!nextStep) {
        exe.status = ExecutionStatus.Completed;
        exe.completedAt = new Date().toISOString();
        exe.currentStepId = undefined;
      } else {
        exe.currentStepId = nextStep.id;
      }
    },

    cancelExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (exe && exe.status === ExecutionStatus.Running) {
        exe.status = ExecutionStatus.Cancelled;
        exe.completedAt = new Date().toISOString();
      }
    },

    failExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (exe && exe.status === ExecutionStatus.Running) {
        exe.status = ExecutionStatus.Failed;
        exe.completedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addWorkflow,
  publishWorkflow,
  archiveWorkflow,
  createNewVersion,
  addExecution,
  advanceExecution,
  cancelExecution,
  failExecution,
} = workflowsSlice.actions;

export default workflowsSlice.reducer;
