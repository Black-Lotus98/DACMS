'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addRecord } from '../store/slice';
import { RecordStatus, SecrecyLevel } from '../types';

export function RecordFormPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { local } = useParams<{ local: string }>();

  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('CORR');
  const [boxCode, setBoxCode] = useState('R01-RW01-CB01-SH1-BX1');
  const [secrecy, setSecrecy] = useState<SecrecyLevel>(SecrecyLevel.Restricted);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `rec-${Date.now()}`;
    dispatch(addRecord({
      id,
      refNo: `REC-2026-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
      title,
      docType,
      boxCode,
      status: RecordStatus.Draft,
      secrecy,
    }));
    router.push(`/${local}/records`);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">تسجيل سجل جديد</h1>
      <form onSubmit={onSubmit} className="rounded-xl border bg-background p-4 space-y-4">
        <div>
          <label className="text-sm mb-1 block">العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full h-10 rounded-md border px-3" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm mb-1 block">نوع الوثيقة</label>
            <input value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full h-10 rounded-md border px-3" />
          </div>
          <div>
            <label className="text-sm mb-1 block">الصندوق</label>
            <input value={boxCode} onChange={(e) => setBoxCode(e.target.value)} className="w-full h-10 rounded-md border px-3" />
          </div>
        </div>
        <div>
          <label className="text-sm mb-1 block">السرية</label>
          <select value={secrecy} onChange={(e) => setSecrecy(e.target.value as SecrecyLevel)} className="w-full h-10 rounded-md border px-3">
            <option value={SecrecyLevel.Public}>public</option>
            <option value={SecrecyLevel.Restricted}>restricted</option>
            <option value={SecrecyLevel.Confidential}>confidential</option>
            <option value={SecrecyLevel.TopSecret}>top_secret</option>
          </select>
        </div>
        <button type="submit" className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          حفظ السجل
        </button>
      </form>
    </div>
  );
}
