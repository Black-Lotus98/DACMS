import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { dispatchesSeed, lendingRequestsSeed } from '../data';
import { LendingStatus, type LendingRequest, type LendingState } from '../types';

const initialState: LendingState = { requests: lendingRequestsSeed, dispatches: dispatchesSeed };

const lendingSlice = createSlice({
  name: 'lending',
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<LendingRequest>) { state.requests.unshift(action.payload); },
    setRequestStatus(state, action: PayloadAction<{ id: string; status: LendingStatus }>) {
      const req = state.requests.find((r) => r.id === action.payload.id);
      if (!req) return;

      const next = action.payload.status;
      const allowed: Record<LendingStatus, LendingStatus[]> = {
        [LendingStatus.Pending]: [LendingStatus.Approved],
        [LendingStatus.Approved]: [LendingStatus.Active],
        [LendingStatus.Active]: [LendingStatus.Returned, LendingStatus.Overdue],
        [LendingStatus.Overdue]: [LendingStatus.Returned],
        [LendingStatus.Returned]: [],
      };

      if (!allowed[req.status].includes(next)) return;
      req.status = next;
    },
    refreshOverdue(state) {
      const today = new Date().toISOString().slice(0, 10);
      state.requests.forEach((req) => {
        if (
          (req.status === LendingStatus.Active || req.status === LendingStatus.Approved) &&
          req.dueDate < today
        ) {
          req.status = LendingStatus.Overdue;
        }
      });
    },
  },
});

export const { addRequest, setRequestStatus, refreshOverdue } = lendingSlice.actions;
export default lendingSlice.reducer;
