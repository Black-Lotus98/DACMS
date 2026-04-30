import { describe, it, expect } from 'vitest';
import reducer, { approveRequest, dispatchRequest, refreshOverdue } from './slice';
import { LendingStatus } from '../types';

describe('m6 lending slice', () => {
  it('approves a pending request', () => {
    const state = reducer(undefined, approveRequest({ requestId: 'lr1', approvedBy: 'supervisor1' }));
    const req = state.requests.find((r) => r.id === 'lr1');
    expect(req?.status).toBe(LendingStatus.Approved);
    expect(req?.approvedBy).toBe('supervisor1');
  });

  it('does not dispatch a pending (non-approved) request', () => {
    const state = reducer(undefined, dispatchRequest({ requestId: 'lr1', messengerId: 'msg1' }));
    const req = state.requests.find((r) => r.id === 'lr1');
    expect(req?.status).toBe(LendingStatus.Pending);
  });

  it('marks active request overdue when due date has passed', () => {
    let state = reducer(undefined, approveRequest({ requestId: 'lr1', approvedBy: 'supervisor1' }));
    state = reducer(state, dispatchRequest({ requestId: 'lr1', messengerId: 'msg1' }));
    state = {
      ...state,
      requests: state.requests.map((r) =>
        r.id === 'lr1' ? { ...r, dueDate: '2000-01-01' } : r
      ),
    };
    state = reducer(state, refreshOverdue());
    const req = state.requests.find((r) => r.id === 'lr1');
    expect(req?.status).toBe(LendingStatus.Overdue);
  });
});
