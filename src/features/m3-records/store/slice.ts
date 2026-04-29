import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { recordsSeed, locationHistorySeed } from '../data';
import type { RecordItem, RecordsState } from '../types';

const initialState: RecordsState = { items: recordsSeed, locationHistory: locationHistorySeed };

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    addRecord(state, action: PayloadAction<RecordItem>) { state.items.unshift(action.payload); },
    moveRecord(state, action: PayloadAction<{ recordId: string; toBox: string }>) {
      const rec = state.items.find((r) => r.id === action.payload.recordId);
      if (!rec) return;
      const old = rec.boxCode;
      rec.boxCode = action.payload.toBox;
      state.locationHistory.unshift({ id: `lh-${Date.now()}`, recordId: rec.id, fromBox: old, toBox: action.payload.toBox, movedAt: new Date().toISOString() });
    },
  },
});

export const { addRecord, moveRecord } = recordsSlice.actions;
export default recordsSlice.reducer;
