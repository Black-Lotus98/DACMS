import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { recordsSeed, locationHistorySeed, recordFilesSeed } from '../data';
import type { RecordItem, RecordFile, RecordsState, RecordStatus } from '../types';

const initialState: RecordsState = {
  items: recordsSeed,
  locationHistory: locationHistorySeed,
  files: recordFilesSeed,
};

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    addRecord(state, action: PayloadAction<RecordItem>) {
      state.items.unshift(action.payload);
    },

    updateRecord(state, action: PayloadAction<Partial<RecordItem> & { id: string }>) {
      const rec = state.items.find((r) => r.id === action.payload.id);
      if (rec) Object.assign(rec, action.payload);
    },

    updateRecordStatus(state, action: PayloadAction<{ recordId: string; status: RecordStatus }>) {
      const rec = state.items.find((r) => r.id === action.payload.recordId);
      if (rec) rec.status = action.payload.status;
    },

    moveRecord(
      state,
      action: PayloadAction<{ recordId: string; toBox: string; movedBy: string; reason: string }>
    ) {
      const rec = state.items.find((r) => r.id === action.payload.recordId);
      if (!rec) return;
      const fromBox = rec.boxId;
      rec.boxId = action.payload.toBox;
      state.locationHistory.unshift({
        id: `lh-${Date.now()}`,
        recordId: rec.id,
        fromBox,
        toBox: action.payload.toBox,
        movedAt: new Date().toISOString(),
        movedBy: action.payload.movedBy,
        reason: action.payload.reason,
      });
    },

    addRecordFile(state, action: PayloadAction<RecordFile>) {
      state.files.push(action.payload);
    },
  },
});

export const { addRecord, updateRecord, updateRecordStatus, moveRecord, addRecordFile } =
  recordsSlice.actions;
export default recordsSlice.reducer;
