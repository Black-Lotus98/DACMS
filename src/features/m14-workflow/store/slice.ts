import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { executionsSeed, workflowsSeed } from '../data';
import { ExecutionStatus, type Workflow, type WorkflowExecution, type WorkflowsState } from '../types';

const initialState: WorkflowsState = { definitions: workflowsSeed, executions: executionsSeed };

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    addWorkflow(state, action: PayloadAction<Workflow>) { state.definitions.unshift(action.payload); },
    publishWorkflow(state, action: PayloadAction<string>) {
      const wf = state.definitions.find((w) => w.id === action.payload);
      if (!wf) return;
      state.definitions.forEach((item) => {
        if (item.status === 'published') item.status = 'archived' as Workflow['status'];
      });
      wf.status = 'published' as Workflow['status'];
    },
    addExecution(state, action: PayloadAction<WorkflowExecution>) { state.executions.unshift(action.payload); },
    advanceExecution(state, action: PayloadAction<string>) {
      const exe = state.executions.find((e) => e.id === action.payload);
      if (!exe) return;
      const wf = state.definitions.find((w) => w.id === exe.workflowId);
      if (!wf) return;
      if (exe.currentStep >= wf.steps.length) {
        exe.status = ExecutionStatus.Done;
        return;
      }
      exe.currentStep += 1;
      exe.status =
        exe.currentStep >= wf.steps.length
          ? ExecutionStatus.Done
          : ExecutionStatus.InProgress;
    },
  },
});

export const { addWorkflow, publishWorkflow, addExecution, advanceExecution } = workflowsSlice.actions;
export default workflowsSlice.reducer;
