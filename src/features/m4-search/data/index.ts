import { RecordStatus, SecrecyLevel } from '@/features/m3-records/types';
import type { SavedQuery, SearchResult } from '../types';

export const searchResultsSeed: SearchResult[] = [
  {
    id:          'rec1',
    refNo:       'REC-2026-00001',
    titleAr:     'محضر اجتماع لجنة المراجعة',
    titleEn:     'Review Committee Minutes',
    docTypeId:   'dt1',
    categoryId:  'cat1',
    boxId:       'bx1',
    status:      RecordStatus.Archived,
    secrecy:     SecrecyLevel.Internal,
    archiveDate: '2026-01-20',
  },
  {
    id:          'rec2',
    refNo:       'REC-2026-00002',
    titleAr:     'عقد توريد خدمات',
    titleEn:     'Service Supply Contract',
    docTypeId:   'dt2',
    categoryId:  'cat2',
    boxId:       'bx3',
    status:      RecordStatus.Active,
    secrecy:     SecrecyLevel.Secret,
    archiveDate: '2026-02-05',
  },
  {
    id:          'rec3',
    refNo:       'REC-2026-00003',
    titleAr:     'تقرير مالي ربع سنوي',
    titleEn:     'Quarterly Financial Report',
    docTypeId:   'dt3',
    categoryId:  'cat3',
    boxId:       'bx4',
    status:      RecordStatus.Archived,
    secrecy:     SecrecyLevel.TopSecret,
    archiveDate: '2026-04-05',
  },
];

export const savedQueriesSeed: SavedQuery[] = [
  {
    id:        'sq1',
    name:      'Contracts',
    userId:    'user1',
    filters:   { query: 'contract', docTypeId: 'dt2' },
    createdAt: '2026-04-01T08:00:00Z',
  },
  {
    id:        'sq2',
    name:      'Secret archived records',
    userId:    'user1',
    filters:   { query: '', secrecy: SecrecyLevel.Secret, status: RecordStatus.Archived },
    createdAt: '2026-04-10T10:00:00Z',
  },
];
