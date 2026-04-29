export enum BarcodeType { Code128='code128', QR='qr' }
export enum PrintStatus { Queued='queued', Printing='printing', Done='done' }

export interface BarcodeLabel { id: string; entityId: string; code: string; type: BarcodeType; active: boolean }
export interface PrintJob { id: string; title: string; count: number; status: PrintStatus }
export interface BarcodesState { labels: BarcodeLabel[]; printJobs: PrintJob[] }
