export enum DestructionStatus { Watchlist='watchlist', PendingApproval='pending_approval', Approved='approved', Destroyed='destroyed' }
export enum MigrationType { Internal='internal', External='external' }

export interface DestructionRequest {
  id: string;
  recordRef: string;
  reason: string;
  status: DestructionStatus;
  approvalLevel: 1 | 2 | 3;
}

export interface MigrationRequest {
  id: string;
  recordRef: string;
  target: string;
  type: MigrationType;
}

export interface DestructionState {
  requests: DestructionRequest[];
  migrations: MigrationRequest[];
}
