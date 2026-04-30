import { describe, it, expect } from 'vitest';
import reducer, { approveRequest, executeDestruction, rejectRequest, submitForLegalReview } from './slice';
import { DestructionStatus } from '../types';

describe('m7 destruction slice', () => {
  it('follows the full approval flow: pending → legal_review → approved → executed', () => {
    let state = reducer(undefined, submitForLegalReview('dr2'));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.LegalReview);

    state = reducer(state, approveRequest({ requestId: 'dr2', approvedBy: 'director1' }));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.Approved);

    state = reducer(state, executeDestruction({ requestId: 'dr2', certificate: '/certs/dr2.pdf' }));
    const req = state.requests.find((r) => r.id === 'dr2');
    expect(req?.status).toBe(DestructionStatus.Executed);
    expect(req?.certificate).toBe('/certs/dr2.pdf');
    expect(req?.executedAt).toBeDefined();
  });

  it('cannot execute before approval', () => {
    const state = reducer(undefined, executeDestruction({ requestId: 'dr2', certificate: '/certs/dr2.pdf' }));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.Pending);
  });

  it('rejects a pending request with reason', () => {
    const state = reducer(undefined, rejectRequest({
      requestId: 'dr2', rejectedBy: 'legal1', rejectionReason: 'Insufficient justification',
    }));
    const req = state.requests.find((r) => r.id === 'dr2');
    expect(req?.status).toBe(DestructionStatus.Rejected);
    expect(req?.rejectionReason).toBe('Insufficient justification');
  });
});
