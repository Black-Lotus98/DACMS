import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { barcodeLabelsSeed, printJobsSeed } from '../data';
import { PrintStatus, type BarcodesState, type BarcodeLabel, type BarcodeType, type PrintJob } from '../types';

const initialState: BarcodesState = {
  labels:    barcodeLabelsSeed,
  printJobs: printJobsSeed,
};

const barcodesSlice = createSlice({
  name: 'barcodes',
  initialState,
  reducers: {
    addLabel(state, action: PayloadAction<BarcodeLabel>) {
      state.labels.unshift(action.payload);
    },

    markPrinted(state, action: PayloadAction<string>) {
      const label = state.labels.find((l) => l.id === action.payload);
      if (label) label.printedAt = new Date().toISOString();
    },

    replaceBarcode(
      state,
      action: PayloadAction<{ oldLabelId: string; newLabel: BarcodeLabel }>
    ) {
      const old = state.labels.find((l) => l.id === action.payload.oldLabelId);
      if (old) old.isActive = false;
      state.labels.unshift(action.payload.newLabel);
    },

    addPrintJob(state, action: PayloadAction<PrintJob>) {
      state.printJobs.unshift(action.payload);
    },

    cyclePrintJobStatus(state, action: PayloadAction<string>) {
      const job = state.printJobs.find((j) => j.id === action.payload);
      if (!job) return;
      if (job.status === PrintStatus.Queued)    job.status = PrintStatus.Printing;
      else if (job.status === PrintStatus.Printing) job.status = PrintStatus.Done;
    },
  },
});

export const { addLabel, markPrinted, replaceBarcode, addPrintJob, cyclePrintJobStatus } =
  barcodesSlice.actions;
export default barcodesSlice.reducer;
