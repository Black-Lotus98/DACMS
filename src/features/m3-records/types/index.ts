export enum RecordStatus {
  Active    = 'ACTIVE',
  Lent      = 'LENT',
  Destroyed = 'DESTROYED',
  Migrated  = 'MIGRATED',
  Archived  = 'ARCHIVED',
}

export enum SecrecyLevel {
  Public    = 'PUBLIC',
  Internal  = 'INTERNAL',
  Secret    = 'SECRET',
  TopSecret = 'TOP_SECRET',
}

export interface RecordItem {
  id: string;
  refNo: string;
  titleAr: string;
  titleEn: string;
  docTypeId: string;
  categoryId: string;
  boxId: string;
  shelfId: string;
  status: RecordStatus;
  secrecy: SecrecyLevel;
  issueDate: string;
  archiveDate: string;
  retentionEnd: string;
  metadata: Record<string, string>;
  createdBy: string;
}

export interface LocationHistory {
  id: string;
  recordId: string;
  fromBox: string;
  toBox: string;
  movedAt: string;
  movedBy: string;
  reason: string;
}

export interface RecordFile {
  id: string;
  recordId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface RecordsState {
  items: RecordItem[];
  locationHistory: LocationHistory[];
  files: RecordFile[];
}
