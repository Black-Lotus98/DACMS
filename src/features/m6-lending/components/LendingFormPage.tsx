'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addRequest } from '../store/slice';
import { LendingStatus } from '../types';
import { RecordStatus } from '@/features/m3-records';

export function LendingFormPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { local } = useParams<{ local: string }>();
  const records = useAppSelector((s) => s.records.items);
  const lendingRequests = useAppSelector((s) => s.lending.requests);

  const [requester, setRequester] = useState('');
  const [recordRef, setRecordRef] = useState('REC-2026-00001');
  const [purpose, setPurpose] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    if (dueDate <= today) {
      setError('Due date must be later than today.');
      return;
    }

    const record = records.find((r) => r.refNo === recordRef);
    if (!record) {
      setError('Record reference does not exist.');
      return;
    }
    if (record.status === RecordStatus.Destroyed || record.status === RecordStatus.Migrated) {
      setError('Destroyed or migrated records cannot be requested for lending.');
      return;
    }

    const alreadyOpen = lendingRequests.some(
      (req) =>
        req.recordRef === recordRef &&
        [LendingStatus.Pending, LendingStatus.Approved, LendingStatus.Active, LendingStatus.Overdue].includes(req.status)
    );
    if (alreadyOpen) {
      setError('This record already has an open lending request.');
      return;
    }
    setError('');
    dispatch(addRequest({
      id: `lr-${Date.now()}`,
      requester,
      recordRef,
      purpose,
      dueDate,
      status: LendingStatus.Pending,
    }));
    router.push(`/${local}/lending`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New lending request</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm mb-1 block">Requesting department</label>
          <input required value={requester} onChange={(e)=>setRequester(e.target.value)} className="w-full h-10 rounded-md border px-3" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Record reference</label>
          <input required value={recordRef} onChange={(e)=>setRecordRef(e.target.value)} className="w-full h-10 rounded-md border px-3 font-mono" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Lending purpose</label>
          <textarea required value={purpose} onChange={(e)=>setPurpose(e.target.value)} className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Due date</label>
          <input required type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} className="w-full h-10 rounded-md border px-3" />
        </div>
        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">Save request</button>
      </form>
    </div>
  );
}
