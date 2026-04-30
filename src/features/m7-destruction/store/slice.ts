import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { destructionItemsSeed, destructionRequestsSeed, migrationRequestsSeed } from '../data';
import {
  DestructionStatus, MigrationStatus,
  type DestructionItem, type DestructionRequest, type DestructionState, type MigrationRequest,
} from '../types';

const initialState: DestructionState = {
  requests:   destructionRequestsSeed,
  items:      destructionItemsSeed,
  migrations: migrationRequestsSeed,
};

const destructionSlice = createSlice({
  name: 'destruction',
  initialState,
  reducers: {
    addDestructionRequest(state, action: PayloadAction<DestructionRequest>) {
      state.requests.unshift(action.payload);
    },

    addDestructionItem(state, action: PayloadAction<DestructionItem>) {
      state.items.push(action.payload);
    },

    submitForLegalReview(state, action: PayloadAction<string>) {
      const req = state.requests.find((r) => r.id === action.payload);
      if (req && req.status === DestructionStatus.Pending) {
        req.status = DestructionStatus.LegalReview;
      }
    },

    approveRequest(
      state,
      action: PayloadAction<{ requestId: string; approvedBy: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status !== DestructionStatus.LegalReview) return;
      req.status     = DestructionStatus.Approved;
      req.approvedBy = action.payload.approvedBy;
    },

    rejectRequest(
      state,
      action: PayloadAction<{ requestId: string; rejectedBy: string; rejectionReason: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status === DestructionStatus.Executed) return;
      req.status          = DestructionStatus.Rejected;
      req.rejectedBy      = action.payload.rejectedBy;
      req.rejectionReason = action.payload.rejectionReason;
    },

    executeDestruction(
      state,
      action: PayloadAction<{ requestId: string; certificate: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status !== DestructionStatus.Approved) return;
      req.status      = DestructionStatus.Executed;
      req.executedAt  = new Date().toISOString();
      req.certificate = action.payload.certificate;
    },

    addMigration(state, action: PayloadAction<MigrationRequest>) {
      state.migrations.unshift(action.payload);
    },

    updateMigrationStatus(
      state,
      action: PayloadAction<{ id: string; status: MigrationStatus }>
    ) {
      const mig = state.migrations.find((m) => m.id === action.payload.id);
      if (mig) mig.status = action.payload.status;
    },
  },
});

export const {
  addDestructionRequest, addDestructionItem,
  submitForLegalReview, approveRequest, rejectRequest, executeDestruction,
  addMigration, updateMigrationStatus,
} = destructionSlice.actions;
export default destructionSlice.reducer;
