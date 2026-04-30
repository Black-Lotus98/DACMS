import { describe, it, expect } from 'vitest';
import reducer, {
  approveDirector,
  approveLegal,
  approveSupervisor,
  executeDestruction,
  rejectRequest,
  submitForSupervisorReview,
} from './slice';
import { DestructionStatus } from '../types';

describe('m7 destruction slice', () => {
  it('follows the full approval flow: pending → supervisor → legal → director → approved → executed', () => {
    let state = reducer(undefined, submitForSupervisorReview('dr2'));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.SupervisorReview);

    state = reducer(state, approveSupervisor({ requestId: 'dr2', approvedBy: 'supervisor1' }));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.LegalReview);

    state = reducer(state, approveLegal({ requestId: 'dr2', approvedBy: 'legal1' }));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.DirectorReview);

    state = reducer(state, approveDirector({ requestId: 'dr2', approvedBy: 'director1' }));
    expect(state.requests.find((r) => r.id === 'dr2')?.status).toBe(DestructionStatus.Approved);

    state = reducer(state, executeDestruction({ requestId: 'dr2', certificate: '/certs/dr2.pdf', executedBy: 'officer1' }));
    const req = state.requests.find((r) => r.id === 'dr2');
    expect(req?.status).toBe(DestructionStatus.Executed);
    expect(req?.certificate).toBe('/certs/dr2.pdf');
    expect(req?.executedAt).toBeDefined();
    expect(req?.executedBy).toBe('officer1');
  });

  it('cannot execute before approval', () => {
    const state = reducer(undefined, executeDestruction({ requestId: 'dr2', certificate: '/certs/dr2.pdf', executedBy: 'officer1' }));
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
