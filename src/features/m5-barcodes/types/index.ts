export enum EntityType {
  Room    = 'ROOM',
  Row     = 'ROW',
  Cabinet = 'CABINET',
  Shelf   = 'SHELF',
  Box     = 'BOX',
  Record  = 'RECORD',
}

export enum BarcodeType {
  Code128 = 'CODE128',
  QR      = 'QR_CODE',
}

export enum PrintStatus {
  Queued   = 'QUEUED',
  Printing = 'PRINTING',
  Done     = 'DONE',
}

export interface BarcodeLabel {
  id:          string;
  entityType:  EntityType;
  entityId:    string;
  barcodeVal:  string;
  type:        BarcodeType;
  generatedAt: string;
  printedAt?:  string;
  isActive:    boolean;
}

export interface PrintJob {
  id:          string;
  createdBy:   string;
  labelIds:    string[];
  status:      PrintStatus;
  printFormat: string;
  queuedAt:    string;
}

export interface BarcodesState {
  labels:    BarcodeLabel[];
  printJobs: PrintJob[];
}
