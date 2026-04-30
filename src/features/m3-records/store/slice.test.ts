import { describe, it, expect } from 'vitest';
import reducer, { addRecord, moveRecord } from './slice';
import { RecordStatus, SecrecyLevel } from '../types';

describe('m3 records slice', () => {
  it('adds record to top of list', () => {
    const state = reducer(undefined, addRecord({
      id:          'new',
      refNo:       'REC-2026-99999',
      titleAr:     'سجل تجريبي',
      titleEn:     'Test Record',
      docTypeId:   'dt1',
      categoryId:  'cat1',
      boxId:       'bx1',
      shelfId:     'sh1',
      status:      RecordStatus.Active,
      secrecy:     SecrecyLevel.Public,
      issueDate:   '2026-01-01',
      archiveDate: '2026-01-05',
      retentionEnd: '2031-01-05',
      metadata:    {},
      createdBy:   'user1',
    }));

    expect(state.items[0].id).toBe('new');
  });

  it('moves record and appends history entry', () => {
    const state = reducer(
      undefined,
      moveRecord({ recordId: 'rec1', toBox: 'bx2', movedBy: 'user1', reason: 'Relocation' })
    );
    const moved = state.items.find((i) => i.id === 'rec1');

    expect(moved?.boxId).toBe('bx2');
    expect(state.locationHistory[0].recordId).toBe('rec1');
  });
});
