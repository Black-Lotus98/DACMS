export enum DestructionStatus {
  Pending          = 'PENDING',
  SupervisorReview = 'SUPERVISOR_REVIEW',
  LegalReview      = 'LEGAL_REVIEW',
  DirectorReview   = 'DIRECTOR_REVIEW',
  Approved         = 'APPROVED',
  Rejected         = 'REJECTED',
  Executed         = 'EXECUTED',
}

export enum MigrationType {
  Physical = 'PHYSICAL',
  Digital  = 'DIGITAL',
  Both     = 'BOTH',
}

export enum MigrationStatus {
  Pending    = 'PENDING',
  Approved   = 'APPROVED',
  InProgress = 'IN_PROGRESS',
  Completed  = 'COMPLETED',
}

export interface DestructionRequest {
  id:            string;
  refNo:         string;
  requesterId:   string;
  justification: string;
  legalBasis?:   string;
  status:        DestructionStatus;
  supervisorApprovedBy?: string;
  legalApprovedBy?: string;
  approvedBy?:   string;
  executedBy?:   string;
  executedAt?:   string;
  certificate?:  string;
  rejectedBy?:   string;
  rejectionReason?: string;
}

export interface DestructionItem {
  id:           string;
  requestId:    string;
  recordId:     string;
  retentionEnd: string;
}

export interface MigrationRequest {
  id:          string;
  refNo:       string;
  requesterId: string;
  destination: string;
  type:        MigrationType;
  status:      MigrationStatus;
}

export interface DestructionState {
  requests:   DestructionRequest[];
  items:      DestructionItem[];
  migrations: MigrationRequest[];
}
