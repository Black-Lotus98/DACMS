export enum RecordStatus { Draft='draft', Archived='archived', Moved='moved' }
export enum SecrecyLevel { Public='public', Restricted='restricted', Confidential='confidential', TopSecret='top_secret' }

export interface RecordItem {
  id: string;
  refNo: string;
  title: string;
  docType: string;
  boxCode: string;
  status: RecordStatus;
  secrecy: SecrecyLevel;
}

export interface LocationHistory {
  id: string;
  recordId: string;
  fromBox: string;
  toBox: string;
  movedAt: string;
}

export interface RecordsState {
  items: RecordItem[];
  locationHistory: LocationHistory[];
}
