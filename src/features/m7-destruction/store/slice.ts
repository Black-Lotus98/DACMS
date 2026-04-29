import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { destructionRequestsSeed, migrationRequestsSeed } from '../data';
import { DestructionStatus, type DestructionRequest, type DestructionState, type MigrationRequest } from '../types';

const initialState: DestructionState = { requests: destructionRequestsSeed, migrations: migrationRequestsSeed };

const destructionSlice = createSlice({
  name: 'destruction',
  initialState,
  reducers: {
    addDestructionRequest(state, action: PayloadAction<DestructionRequest>) { state.requests.unshift(action.payload); },
    setDestructionStatus(state, action: PayloadAction<{ id: string; status: DestructionStatus }>) {
      const req = state.requests.find((r) => r.id === action.payload.id);
      if (!req) return;
      // Hard business rule: cannot destroy before all 3 approvals are completed.
      if (action.payload.status === DestructionStatus.Destroyed && req.approvalLevel < 3) return;
      req.status = action.payload.status;
    },
    advanceApprovalLevel(state, action: PayloadAction<string>) {
      const req = state.requests.find((r) => r.id === action.payload);
      if (!req || req.status === DestructionStatus.Destroyed) return;
      if (req.approvalLevel < 3) {
        req.approvalLevel = (req.approvalLevel + 1) as 1 | 2 | 3;
      }
      req.status =
        req.approvalLevel >= 3
          ? DestructionStatus.Approved
          : DestructionStatus.PendingApproval;
    },
    addMigration(state, action: PayloadAction<MigrationRequest>) { state.migrations.unshift(action.payload); },
  },
});

export const { addDestructionRequest, setDestructionStatus, advanceApprovalLevel, addMigration } = destructionSlice.actions;
export default destructionSlice.reducer;
