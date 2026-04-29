import type { SavedQuery, SearchResult } from '../types';

export const searchResultsSeed: SearchResult[] = [
  { id: 'rec1', refNo: 'REC-2026-00001', title: 'Review Committee Minutes', locationCode: 'R01-RW01-CB01-SH1-BX1', secrecy: 'confidential' },
  { id: 'rec2', refNo: 'REC-2026-00002', title: 'Service Supply Contract', locationCode: 'R01-RW02-CB01-SH2-BX3', secrecy: 'restricted' },
  { id: 'rec3', refNo: 'REC-2026-00003', title: 'Quarterly Financial Report', locationCode: 'R02-RW03-CB02-SH1-BX4', secrecy: 'top_secret' },
];

export const savedQueriesSeed: SavedQuery[] = [
  { id: 'sq1', name: 'عقود', filters: { query: 'عقد' } },
  { id: 'sq2', name: 'سجلات Confidential', filters: { query: 'تقرير', secrecy: 'confidential' } },
];
