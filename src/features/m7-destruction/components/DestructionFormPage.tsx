'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addDestructionItem, addDestructionRequest } from '../store/slice';
import { DestructionStatus } from '../types';
import { RecordStatus } from '@/features/m3-records';

const INPUT = 'w-full h-9 rounded-md border px-3 text-sm';

export function DestructionFormPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { local } = useParams<{ local: string }>();

  const records             = useAppSelector((s) => s.records.items);
  const destructionItems    = useAppSelector((s) => s.destruction.items);
  const destructionRequests = useAppSelector((s) => s.destruction.requests);

  const [requesterId,   setRequesterId]   = useState('');
  const [justification, setJustification] = useState('');
  const [recordId,      setRecordId]      = useState('');
  const [error,         setError]         = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const record = records.find((r) => r.id === recordId || r.refNo === recordId);
    if (!record) {
      setError('Record not found.');
      return;
    }
    if (record.status === RecordStatus.Destroyed) {
      setError('Record is already destroyed.');
      return;
    }

    const hasOpen = destructionItems.some((item) => {
      if (item.recordId !== record.id) return false;
      const req = destructionRequests.find((r) => r.id === item.requestId);
      return req && req.status !== DestructionStatus.Executed && req.status !== DestructionStatus.Rejected;
    });
    if (hasOpen) {
      setError('This record already has an active destruction request.');
      return;
    }

    setError('');
    const reqId = `dr-${Date.now()}`;
    dispatch(addDestructionRequest({
      id:            reqId,
      refNo:         `DST-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      requesterId:   requesterId.trim(),
      justification: justification.trim(),
      status:        DestructionStatus.Pending,
    }));
    dispatch(addDestructionItem({
      id:           `di-${Date.now()}`,
      requestId:    reqId,
      recordId:     record.id,
      retentionEnd: record.retentionEnd,
    }));
    router.push(`/${local}/destruction`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New destruction request</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="text-sm mb-1 block">Requester ID</label>
          <input required value={requesterId} onChange={(e) => setRequesterId(e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className="text-sm mb-1 block">Record ID or reference</label>
          <input required value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="e.g. rec1 or REC-2026-00001" className={`${INPUT} font-mono`} />
        </div>

        <div>
          <label className="text-sm mb-1 block">Justification</label>
          <textarea required value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Submit request
        </button>
      </form>
    </div>
  );
}
