'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLendingItem, addRequest } from '../store/slice';
import { ItemStatus, LendingStatus } from '../types';
import { RecordStatus } from '@/features/m3-records';

const INPUT = 'w-full h-9 rounded-md border px-3 text-sm';

export function LendingFormPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { local } = useParams<{ local: string }>();

  const records        = useAppSelector((s) => s.records.items);
  const lendingItems   = useAppSelector((s) => s.lending.items);
  const lendingRequests = useAppSelector((s) => s.lending.requests);

  const [requesterId, setRequesterId] = useState('');
  const [deptId,      setDeptId]      = useState('');
  const [purpose,     setPurpose]     = useState('');
  const [dueDate,     setDueDate]     = useState('');
  const [recordId,    setRecordId]    = useState('');
  const [error,       setError]       = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    if (dueDate && dueDate <= today) {
      setError('Due date must be later than today.');
      return;
    }

    const record = records.find((r) => r.id === recordId || r.refNo === recordId);
    if (!record) {
      setError('Record not found.');
      return;
    }
    if (record.status === RecordStatus.Destroyed || record.status === RecordStatus.Migrated) {
      setError('Destroyed or migrated records cannot be requested for lending.');
      return;
    }

    const alreadyOpen = lendingItems.some((item) => {
      if (item.recordId !== record.id) return false;
      const req = lendingRequests.find((r) => r.id === item.requestId);
      return req && [LendingStatus.Pending, LendingStatus.Approved, LendingStatus.Dispatched, LendingStatus.Active, LendingStatus.Overdue].includes(req.status);
    });
    if (alreadyOpen) {
      setError('This record already has an open lending request.');
      return;
    }

    setError('');
    const reqId = `lr-${Date.now()}`;
    dispatch(addRequest({
      id:          reqId,
      refNo:       `LND-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      requesterId: requesterId.trim(),
      deptId:      deptId.trim(),
      purpose:     purpose.trim(),
      status:      LendingStatus.Pending,
      requestedAt: new Date().toISOString(),
      dueDate:     dueDate || undefined,
    }));
    dispatch(addLendingItem({
      id:        `li-${Date.now()}`,
      requestId: reqId,
      recordId:  record.id,
      status:    ItemStatus.Pending,
    }));
    router.push(`/${local}/lending`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New lending request</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Requester ID</label>
            <input required value={requesterId} onChange={(e) => setRequesterId(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Department ID</label>
            <input required value={deptId} onChange={(e) => setDeptId(e.target.value)} className={INPUT} />
          </div>
        </div>

        <div>
          <label className="text-sm mb-1 block">Record ID or reference</label>
          <input required value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="e.g. rec1 or REC-2026-00001" className={`${INPUT} font-mono`} />
        </div>

        <div>
          <label className="text-sm mb-1 block">Purpose / justification</label>
          <textarea required value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm mb-1 block">Due date (optional)</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={INPUT} />
        </div>

        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Submit request
        </button>
      </form>
    </div>
  );
}
