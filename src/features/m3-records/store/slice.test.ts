import { describe, it, expect } from 'vitest';
import reducer, { addRecord, moveRecord } from './slice';
import { RecordStatus, SecrecyLevel } from '../types';

describe('m3 records slice', () => {
  it('adds record to top of list', () => {
    const state = reducer(undefined, addRecord({
      id: 'new',
      refNo: 'REC-2026-99999',
      title: 'Test',
      docType: 'CORR',
      boxCode: 'R01-RW01-CB01-SH1-BX1',
      status: RecordStatus.Draft,
      secrecy: SecrecyLevel.Public,
    }));

    expect(state.items[0].id).toBe('new');
  });

  it('moves record and appends history entry', () => {
    const state = reducer(undefined, moveRecord({ recordId: 'rec1', toBox: 'R03-RW02-CB01-SH1-BX1' }));
    const moved = state.items.find((i) => i.id === 'rec1');

    expect(moved?.boxCode).toBe('R03-RW02-CB01-SH1-BX1');
    expect(state.locationHistory[0].recordId).toBe('rec1');
  });
});
