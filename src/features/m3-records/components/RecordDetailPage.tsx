'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { moveRecord } from '../store/slice';
import { useRecordsModule } from '../hooks';

export function RecordDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRecordById, getHistoryForRecord, getFilesForRecord } = useRecordsModule();
  const currentUserId = useAppSelector((s) => s.auth.user?.id ?? 'unknown');
  const boxes = useAppSelector((s) => s.archiveStructure.boxes);

  const [toBox,  setToBox]  = useState('');
  const [reason, setReason] = useState('');
  const [moveError, setMoveError] = useState('');

  const record  = getRecordById(id);
  const history = getHistoryForRecord(id);
  const files   = getFilesForRecord(id);

  if (!record) {
    return (
      <div className="space-y-3">
        <p className="text-sm">Record not found or access denied.</p>
        <Link href={`/${local}/records`} className="text-primary hover:underline text-sm">Back to records</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{record.titleEn}</h1>
          <p className="text-sm text-muted-foreground" dir="rtl">{record.titleAr}</p>
        </div>
        <Link href={`/${local}/records`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <h2 className="font-semibold mb-2">Record details</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <p><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{record.refNo}</span></p>
          <p><span className="text-muted-foreground">Status:</span> {record.status}</p>
          <p><span className="text-muted-foreground">Secrecy:</span> {record.secrecy}</p>
          <p><span className="text-muted-foreground">Document type:</span> <span className="font-mono">{record.docTypeId}</span></p>
          <p><span className="text-muted-foreground">Category:</span> <span className="font-mono">{record.categoryId}</span></p>
          <p><span className="text-muted-foreground">Box:</span> <span className="font-mono">{record.boxId}</span></p>
          <p><span className="text-muted-foreground">Shelf:</span> <span className="font-mono">{record.shelfId}</span></p>
          <p><span className="text-muted-foreground">Issue date:</span> {record.issueDate}</p>
          <p><span className="text-muted-foreground">Archive date:</span> {record.archiveDate}</p>
          <p><span className="text-muted-foreground">Retention end:</span> {record.retentionEnd}</p>
          <p><span className="text-muted-foreground">Created by:</span> {record.createdBy}</p>
        </div>
        {Object.keys(record.metadata).length > 0 && (
          <div className="border-t pt-2 mt-2">
            <p className="text-muted-foreground mb-1">Metadata:</p>
            <ul className="space-y-0.5">
              {Object.entries(record.metadata).map(([k, v]) => (
                <li key={k} className="flex gap-2">
                  <span className="font-mono text-xs text-muted-foreground w-32 shrink-0">{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Attached files</h2>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files attached.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 border rounded-md px-3 py-2">
                <span className="flex-1">{f.fileName}</span>
                <span className="text-xs text-muted-foreground">{f.fileType}</span>
                <span className="text-xs text-muted-foreground">{f.uploadedAt.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Move record (F3.9) */}
      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Move record (F3.9)</h2>
        <div className="flex gap-2 flex-wrap">
          <select
            value={toBox}
            onChange={(e) => setToBox(e.target.value)}
            className="h-9 rounded-md border px-2 text-sm flex-1 min-w-40"
          >
            <option value="">Select destination box…</option>
            {boxes.filter((b) => b.isActive && b.id !== record.boxId).map((b) => (
              <option key={b.id} value={b.id}>{b.code} — {b.label}</option>
            ))}
          </select>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for move…"
            className="h-9 rounded-md border px-3 text-sm flex-1 min-w-48"
          />
          <button
            onClick={() => {
              if (!toBox) { setMoveError('Select a destination box.'); return; }
              if (!reason.trim()) { setMoveError('Provide a reason.'); return; }
              dispatch(moveRecord({ recordId: record.id, toBox, movedBy: currentUserId, reason }));
              setToBox(''); setReason(''); setMoveError('');
            }}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            Move
          </button>
        </div>
        {moveError && <p className="text-xs text-red-600">{moveError}</p>}
        <p className="text-xs text-muted-foreground">Current box: <span className="font-mono">{record.boxId}</span></p>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Movement history</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No movement history yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="border rounded-md p-3 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{h.movedAt.slice(0, 10)}</span>
                  <span>{h.fromBox} → {h.toBox}</span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>By: {h.movedBy}</span>
                  <span>{h.reason}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
