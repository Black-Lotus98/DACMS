'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addRecord } from '../store/slice';
import { RecordStatus, SecrecyLevel } from '../types';

const INPUT = 'w-full h-9 rounded-md border px-3 text-sm';

export function RecordFormPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { local } = useParams<{ local: string }>();

  const [titleAr,     setTitleAr]     = useState('');
  const [titleEn,     setTitleEn]     = useState('');
  const [docTypeId,   setDocTypeId]   = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [boxId,       setBoxId]       = useState('');
  const [shelfId,     setShelfId]     = useState('');
  const [secrecy,     setSecrecy]     = useState<SecrecyLevel>(SecrecyLevel.Internal);
  const [issueDate,   setIssueDate]   = useState('');
  const [archiveDate, setArchiveDate] = useState('');
  const [retentionEnd, setRetentionEnd] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `rec-${Date.now()}`;
    dispatch(addRecord({
      id,
      refNo:       `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      titleAr:     titleAr.trim(),
      titleEn:     titleEn.trim(),
      docTypeId:   docTypeId.trim(),
      categoryId:  categoryId.trim(),
      boxId:       boxId.trim(),
      shelfId:     shelfId.trim(),
      status:      RecordStatus.Active,
      secrecy,
      issueDate,
      archiveDate,
      retentionEnd,
      metadata:    {},
      createdBy:   'current-user',
    }));
    router.push(`/${local}/records`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Register new record</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Title (AR)</label>
            <input dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Title (EN)</label>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required className={INPUT} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Document type ID</label>
            <input value={docTypeId} onChange={(e) => setDocTypeId(e.target.value)} placeholder="dt1" className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Category ID</label>
            <input value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="cat1" className={INPUT} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">Box ID</label>
            <input value={boxId} onChange={(e) => setBoxId(e.target.value)} placeholder="bx1" className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Shelf ID</label>
            <input value={shelfId} onChange={(e) => setShelfId(e.target.value)} placeholder="sh1" className={INPUT} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm mb-1 block">Issue date</label>
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Archive date</label>
            <input type="date" value={archiveDate} onChange={(e) => setArchiveDate(e.target.value)} required className={INPUT} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Retention end</label>
            <input type="date" value={retentionEnd} onChange={(e) => setRetentionEnd(e.target.value)} required className={INPUT} />
          </div>
        </div>

        <div>
          <label className="text-sm mb-1 block">Secrecy level</label>
          <select value={secrecy} onChange={(e) => setSecrecy(e.target.value as SecrecyLevel)} className={INPUT}>
            <option value={SecrecyLevel.Public}>Public</option>
            <option value={SecrecyLevel.Internal}>Internal</option>
            <option value={SecrecyLevel.Secret}>Secret</option>
            <option value={SecrecyLevel.TopSecret}>Top Secret</option>
          </select>
        </div>

        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          Save record
        </button>
      </form>
    </div>
  );
}
