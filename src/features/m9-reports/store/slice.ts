import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { reportsSeed } from '../data';
import type { ReportState } from '../types';

const initialState: ReportState = { definitions: reportsSeed, activeReportId: reportsSeed[0]?.id ?? null };

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setActiveReport(state, action: PayloadAction<string>) { state.activeReportId = action.payload; },
  },
});

export const { setActiveReport } = reportsSlice.actions;
export default reportsSlice.reducer;
