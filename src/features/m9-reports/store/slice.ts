import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { reportsSeed } from '../data';
import type { ReportsState, ReportDefinition, ReportSchedule } from '../types';

const initialState: ReportsState = {
  definitions:    reportsSeed,
  activeReportId: reportsSeed[0]?.id ?? null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setActiveReport(state, action: PayloadAction<string>) {
      state.activeReportId = action.payload;
    },
    saveReport(state, action: PayloadAction<ReportDefinition>) {
      const idx = state.definitions.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.definitions[idx] = action.payload;
      else state.definitions.push(action.payload);
    },
    deleteReport(state, action: PayloadAction<string>) {
      state.definitions = state.definitions.filter((r) => r.id !== action.payload);
      if (state.activeReportId === action.payload) state.activeReportId = null;
    },
    updateSchedule(state, action: PayloadAction<{ id: string; schedule: ReportSchedule }>) {
      const report = state.definitions.find((r) => r.id === action.payload.id);
      if (report) report.schedule = action.payload.schedule;
    },
  },
});

export const { setActiveReport, saveReport, deleteReport, updateSchedule } = reportsSlice.actions;
export default reportsSlice.reducer;
