import { describe, it, expect } from 'vitest';
import reducer, { refreshOverdue, setRequestStatus } from './slice';
import { LendingStatus } from '../types';

describe('m6 lending slice', () => {
  it('allows only valid status transitions', () => {
    let state = reducer(undefined, setRequestStatus({ id: 'lr1', status: LendingStatus.Active }));
    const pending = state.requests.find((r) => r.id === 'lr1');
    expect(pending?.status).toBe(LendingStatus.Pending);

    state = reducer(state, setRequestStatus({ id: 'lr1', status: LendingStatus.Approved }));
    state = reducer(state, setRequestStatus({ id: 'lr1', status: LendingStatus.Active }));
    const active = state.requests.find((r) => r.id === 'lr1');
    expect(active?.status).toBe(LendingStatus.Active);
  });

  it('marks approved/active request overdue when due date passed', () => {
    let state = reducer(undefined, setRequestStatus({ id: 'lr1', status: LendingStatus.Approved }));
    state = {
      ...state,
      requests: state.requests.map((r) => r.id === 'lr1' ? { ...r, dueDate: '2000-01-01' } : r),
    };
    state = reducer(state, refreshOverdue());
    const req = state.requests.find((r) => r.id === 'lr1');
    expect(req?.status).toBe(LendingStatus.Overdue);
  });
});
