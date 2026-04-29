import { RecordStatus, SecrecyLevel, type RecordItem, type LocationHistory } from '../types';

export const recordsSeed: RecordItem[] = [
  { id: 'rec1', refNo: 'REC-2026-00001', title: 'Review Committee Minutes', docType: 'CORR', boxCode: 'R01-RW01-CB01-SH1-BX1', status: RecordStatus.Archived, secrecy: SecrecyLevel.Confidential },
  { id: 'rec2', refNo: 'REC-2026-00002', title: 'Service Supply Contract', docType: 'CONT', boxCode: 'R01-RW02-CB01-SH2-BX3', status: RecordStatus.Archived, secrecy: SecrecyLevel.Restricted },
  { id: 'rec3', refNo: 'REC-2026-00003', title: 'Quarterly Financial Report', docType: 'FINR', boxCode: 'R02-RW03-CB02-SH1-BX4', status: RecordStatus.Moved, secrecy: SecrecyLevel.TopSecret },
];

export const locationHistorySeed: LocationHistory[] = [
  { id: 'lh1', recordId: 'rec3', fromBox: 'R02-RW01-CB01-SH1-BX1', toBox: 'R02-RW03-CB02-SH1-BX4', movedAt: '2026-04-20T10:00:00Z' },
];
