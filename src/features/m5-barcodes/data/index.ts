import { BarcodeType, PrintStatus, type BarcodeLabel, type PrintJob } from '../types';

export const barcodeLabelsSeed: BarcodeLabel[] = [
  { id: 'bl1', entityId: 'rec1', code: 'REC-2026-00001', type: BarcodeType.Code128, active: true },
  { id: 'bl2', entityId: 'rec2', code: 'REC-2026-00002', type: BarcodeType.Code128, active: true },
  { id: 'bl3', entityId: 'rm1', code: 'R01', type: BarcodeType.QR, active: true },
];

export const printJobsSeed: PrintJob[] = [
  { id: 'pj1', title: 'Batch Print April', count: 24, status: PrintStatus.Done },
  { id: 'pj2', title: 'Records Queue', count: 8, status: PrintStatus.Printing },
];
