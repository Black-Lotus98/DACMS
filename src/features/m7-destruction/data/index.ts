import { DestructionStatus, MigrationType, type DestructionRequest, type MigrationRequest } from '../types';

export const destructionRequestsSeed: DestructionRequest[] = [
  { id: 'dr1', recordRef: 'REC-2024-00811', reason: 'انتهاء مدة الاحتفاظ', status: DestructionStatus.PendingApproval, approvalLevel: 2 },
  { id: 'dr2', recordRef: 'REC-2022-00210', reason: 'نسخة مكررة', status: DestructionStatus.Watchlist, approvalLevel: 1 },
];

export const migrationRequestsSeed: MigrationRequest[] = [
  { id: 'mr1', recordRef: 'REC-2018-00014', target: 'الأرشيف التاريخي المركزي', type: MigrationType.Internal },
  { id: 'mr2', recordRef: 'REC-2017-00098', target: 'مستودع خارجي مؤمن', type: MigrationType.External },
];
