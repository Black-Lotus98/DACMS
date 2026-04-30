import {
  DestructionStatus, MigrationStatus, MigrationType,
  type DestructionItem, type DestructionRequest, type MigrationRequest,
} from '../types';

export const destructionRequestsSeed: DestructionRequest[] = [
  {
    id:            'dr1',
    refNo:         'DST-2026-00001',
    requesterId:   'user2',
    justification: 'Retention period ended — 10 year policy elapsed',
    legalBasis:    'Law 24/2016 Article 7',
    status:        DestructionStatus.LegalReview,
    supervisorApprovedBy: 'user2',
  },
  {
    id:            'dr2',
    refNo:         'DST-2026-00002',
    requesterId:   'user2',
    justification: 'Duplicate copy — original retained',
    legalBasis:    'Records Policy RP-103',
    status:        DestructionStatus.Pending,
  },
  {
    id:            'dr3',
    refNo:         'DST-2025-00019',
    requesterId:   'user2',
    justification: 'Records expired per ministerial decree',
    legalBasis:    'Ministerial Decree 18/2024',
    status:        DestructionStatus.Executed,
    supervisorApprovedBy: 'user2',
    legalApprovedBy: 'legal1',
    approvedBy:    'user1',
    executedBy:    'user2',
    executedAt:    '2026-03-15T10:00:00Z',
    certificate:   '/certificates/DST-2025-00019.pdf',
  },
];

export const destructionItemsSeed: DestructionItem[] = [
  { id: 'di1', requestId: 'dr1', recordId: 'rec1', retentionEnd: '2026-01-20' },
  { id: 'di2', requestId: 'dr2', recordId: 'rec2', retentionEnd: '2026-02-05' },
  { id: 'di3', requestId: 'dr3', recordId: 'rec3', retentionEnd: '2025-12-31' },
];

export const migrationRequestsSeed: MigrationRequest[] = [
  {
    id:          'mr1',
    refNo:       'MIG-2026-00001',
    requesterId: 'user2',
    destination: 'Central Historical Archive — Building 7',
    type:        MigrationType.Physical,
    status:      MigrationStatus.Approved,
  },
  {
    id:          'mr2',
    refNo:       'MIG-2026-00002',
    requesterId: 'user2',
    destination: 'National Digital Archive Platform',
    type:        MigrationType.Digital,
    status:      MigrationStatus.Pending,
  },
];
