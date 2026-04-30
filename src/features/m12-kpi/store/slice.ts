import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { kpiDefinitionsSeed, kpiSnapshotsSeed } from '../data';
import type { KPIDefinition, KPISnapshot, KpiState } from '../types';

const initialState: KpiState = {
  definitions: kpiDefinitionsSeed,
  snapshots:   kpiSnapshotsSeed,
};

const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    addSnapshot(state, action: PayloadAction<KPISnapshot>) {
      state.snapshots.push(action.payload);
    },
    updateTargetValue(state, action: PayloadAction<{ id: string; targetValue: number }>) {
      const def = state.definitions.find((d) => d.id === action.payload.id);
      if (def) def.targetValue = action.payload.targetValue;
    },
    upsertDefinition(state, action: PayloadAction<KPIDefinition>) {
      const idx = state.definitions.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.definitions[idx] = action.payload;
      else state.definitions.push(action.payload);
    },
  },
});

export const { addSnapshot, updateTargetValue, upsertDefinition } = kpiSlice.actions;
export default kpiSlice.reducer;
