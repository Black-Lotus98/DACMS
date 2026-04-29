import { DestructionStatus, MigrationType, type DestructionRequest, type MigrationRequest } from '../types';

export const destructionRequestsSeed: DestructionRequest[] = [
  { id: 'dr1', recordRef: 'REC-2024-00811', reason: 'Retention period ended', status: DestructionStatus.PendingApproval, approvalLevel: 2 },
  { id: 'dr2', recordRef: 'REC-2022-00210', reason: 'Duplicate copy', status: DestructionStatus.Watchlist, approvalLevel: 1 },
];

export const migrationRequestsSeed: MigrationRequest[] = [
  { id: 'mr1', recordRef: 'REC-2018-00014', target: 'Central historical archive', type: MigrationType.Internal },
  { id: 'mr2', recordRef: 'REC-2017-00098', target: 'Secured external storage', type: MigrationType.External },
];
