import { describe, it, expect } from 'vitest';
import reducer, { advanceApprovalLevel, setDestructionStatus } from './slice';
import { DestructionStatus } from '../types';

describe('m7 destruction slice', () => {
  it('does not allow destruction before level 3 approval', () => {
    const state = reducer(undefined, setDestructionStatus({ id: 'dr2', status: DestructionStatus.Destroyed }));
    const req = state.requests.find((r) => r.id === 'dr2');
    expect(req?.status).not.toBe(DestructionStatus.Destroyed);
  });

  it('promotes to approved at approval level 3', () => {
    let state = reducer(undefined, advanceApprovalLevel('dr2'));
    state = reducer(state, advanceApprovalLevel('dr2'));
    const req = state.requests.find((r) => r.id === 'dr2');
    expect(req?.approvalLevel).toBe(3);
    expect(req?.status).toBe(DestructionStatus.Approved);
  });
});
