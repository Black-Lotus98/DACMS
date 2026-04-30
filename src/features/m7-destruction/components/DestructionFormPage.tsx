'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addDestructionRequest } from '../store/slice';
import { DestructionStatus } from '../types';
import { RecordStatus } from '@/features/m3-records';

export function DestructionFormPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { local } = useParams<{ local: string }>();
  const records = useAppSelector((s) => s.records.items);
  const destructionRequests = useAppSelector((s) => s.destruction.requests);

  const [recordRef, setRecordRef] = useState('REC-2022-00001');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const record = records.find((r) => r.refNo === recordRef);
    if (!record) {
      setError('Record reference does not exist.');
      return;
    }
    if (record.status === RecordStatus.Destroyed) {
      setError('Record is already destroyed.');
      return;
    }
    const hasOpenDestruction = destructionRequests.some(
      (req) =>
        req.recordRef === recordRef &&
        req.status !== 'destroyed'
    );
    if (hasOpenDestruction) {
      setError('This record already has an active destruction request.');
      return;
    }
    setError('');

    dispatch(addDestructionRequest({
      id: `dr-${Date.now()}`,
      recordRef,
      reason,
      status: DestructionStatus.PendingApproval,
      approvalLevel: 1,
    }));
    router.push(`/${local}/destruction`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New destruction request</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm mb-1 block">Record reference</label>
          <input value={recordRef} onChange={(e)=>setRecordRef(e.target.value)} className="w-full h-10 rounded-md border px-3 font-mono" required />
        </div>
        <div>
          <label className="text-sm mb-1 block">Destruction reason</label>
          <textarea value={reason} onChange={(e)=>setReason(e.target.value)} className="w-full rounded-md border px-3 py-2" required />
        </div>
        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">Save request</button>
      </form>
    </div>
  );
}
