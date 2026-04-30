import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { dispatchesSeed, lendingItemsSeed, lendingRequestsSeed } from '../data';
import {
  DispatchDirection, ItemStatus, LendingStatus,
  type LendingItem, type LendingRequest, type LendingState, type MessengerDispatch,
} from '../types';

const initialState: LendingState = {
  requests:  lendingRequestsSeed,
  items:     lendingItemsSeed,
  dispatches: dispatchesSeed,
};

const lendingSlice = createSlice({
  name: 'lending',
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<LendingRequest>) {
      state.requests.unshift(action.payload);
    },

    addLendingItem(state, action: PayloadAction<LendingItem>) {
      state.items.push(action.payload);
    },

    approveRequest(
      state,
      action: PayloadAction<{ requestId: string; approvedBy: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status !== LendingStatus.Pending) return;
      req.status     = LendingStatus.Approved;
      req.approvedBy = action.payload.approvedBy;
      req.approvedAt = new Date().toISOString();
    },

    rejectRequest(
      state,
      action: PayloadAction<{ requestId: string; rejectionReason: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status !== LendingStatus.Pending) return;
      req.status          = LendingStatus.Rejected;
      req.rejectionReason = action.payload.rejectionReason;
    },

    dispatchRequest(
      state,
      action: PayloadAction<{ requestId: string; messengerId: string }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req || req.status !== LendingStatus.Approved) return;
      req.status = LendingStatus.Dispatched;
      state.dispatches.push({
        id:           `md-${Date.now()}`,
        requestId:    req.id,
        messengerId:  action.payload.messengerId,
        direction:    DispatchDirection.Outbound,
        dispatchedAt: new Date().toISOString(),
      });
      state.items
        .filter((i) => i.requestId === req.id)
        .forEach((i) => { i.status = ItemStatus.Dispatched; });
    },

    activateRequest(state, action: PayloadAction<string>) {
      const req = state.requests.find((r) => r.id === action.payload);
      if (!req || req.status !== LendingStatus.Dispatched) return;
      req.status = LendingStatus.Active;
      state.items
        .filter((i) => i.requestId === req.id)
        .forEach((i) => { i.status = ItemStatus.Active; });
    },

    confirmReturn(
      state,
      action: PayloadAction<{ requestId: string; itemIds: string[] }>
    ) {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (!req) return;
      action.payload.itemIds.forEach((itemId) => {
        const item = state.items.find((i) => i.id === itemId);
        if (item) item.status = ItemStatus.Returned;
      });
      const allReturned = state.items
        .filter((i) => i.requestId === action.payload.requestId)
        .every((i) => i.status === ItemStatus.Returned);
      if (allReturned) {
        req.status     = LendingStatus.Returned;
        req.returnedAt = new Date().toISOString();
        state.dispatches.push({
          id:           `md-${Date.now()}`,
          requestId:    req.id,
          messengerId:  'system',
          direction:    DispatchDirection.Inbound,
          dispatchedAt: new Date().toISOString(),
          confirmedAt:  new Date().toISOString(),
        });
      }
    },

    confirmDispatch(state, action: PayloadAction<string>) {
      const dispatch = state.dispatches.find((d) => d.id === action.payload);
      if (dispatch) dispatch.confirmedAt = new Date().toISOString();
    },

    updateLendingItemStatus(
      state,
      action: PayloadAction<{ itemId: string; status: ItemStatus }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) item.status = action.payload.status;
    },

    refreshOverdue(state) {
      const today = new Date().toISOString().slice(0, 10);
      state.requests.forEach((req) => {
        if (
          (req.status === LendingStatus.Active || req.status === LendingStatus.Dispatched) &&
          req.dueDate && req.dueDate < today
        ) {
          req.status = LendingStatus.Overdue;
        }
      });
    },
  },
});

export const {
  addRequest, addLendingItem,
  approveRequest, rejectRequest, dispatchRequest, activateRequest,
  confirmReturn, confirmDispatch, updateLendingItemStatus,
  refreshOverdue,
} = lendingSlice.actions;
export default lendingSlice.reducer;
