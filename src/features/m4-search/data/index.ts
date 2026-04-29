import type { SavedQuery, SearchResult } from '../types';

export const searchResultsSeed: SearchResult[] = [
  { id: 'rec1', refNo: 'REC-2026-00001', title: 'محضر لجنة المراجعة', locationCode: 'R01-RW01-CB01-SH1-BX1', secrecy: 'confidential' },
  { id: 'rec2', refNo: 'REC-2026-00002', title: 'عقد توريد خدمات', locationCode: 'R01-RW02-CB01-SH2-BX3', secrecy: 'restricted' },
  { id: 'rec3', refNo: 'REC-2026-00003', title: 'تقرير مالي ربع سنوي', locationCode: 'R02-RW03-CB02-SH1-BX4', secrecy: 'top_secret' },
];

export const savedQueriesSeed: SavedQuery[] = [
  { id: 'sq1', name: 'عقود', filters: { query: 'عقد' } },
  { id: 'sq2', name: 'سجلات سرية', filters: { query: 'تقرير', secrecy: 'confidential' } },
];
