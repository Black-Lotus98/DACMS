import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { barcodeLabelsSeed, printJobsSeed } from '../data';
import { PrintStatus, type BarcodesState, type BarcodeLabel, type PrintJob } from '../types';

const initialState: BarcodesState = { labels: barcodeLabelsSeed, printJobs: printJobsSeed };

const barcodesSlice = createSlice({
  name: 'barcodes',
  initialState,
  reducers: {
    addLabel(state, action: PayloadAction<BarcodeLabel>) { state.labels.unshift(action.payload); },
    addPrintJob(state, action: PayloadAction<PrintJob>) { state.printJobs.unshift(action.payload); },
    cyclePrintJobStatus(state, action: PayloadAction<string>) {
      const job = state.printJobs.find((j) => j.id === action.payload);
      if (!job) return;
      if (job.status === PrintStatus.Queued) {
        job.status = PrintStatus.Printing;
      } else if (job.status === PrintStatus.Printing) {
        job.status = PrintStatus.Done;
      }
    },
  },
});

export const { addLabel, addPrintJob, cyclePrintJobStatus } = barcodesSlice.actions;
export default barcodesSlice.reducer;
