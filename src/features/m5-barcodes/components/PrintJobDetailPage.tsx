'use client';

import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'next/navigation';
import { useBarcodesModule } from '../hooks';
import { cyclePrintJobStatus, markPrinted } from '../store/slice';
import { PrintStatus } from '../types';

const STATUS_COLOR: Record<PrintStatus, string> = {
  [PrintStatus.Queued]:   'bg-amber-100 text-amber-700',
  [PrintStatus.Printing]: 'bg-blue-100 text-blue-700',
  [PrintStatus.Done]:     'bg-green-100 text-green-700',
};

export function PrintJobDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getPrintJobById } = useBarcodesModule();
  const job = getPrintJobById(id);

  if (!job) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Print job not found</h1>
        <p className="text-sm text-muted-foreground">This print job does not exist.</p>
        <Link href={`/${local}/barcodes`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to barcodes
        </Link>
      </div>
    );
  }

  function advanceAndMarkPrinted() {
    if (!job) return;
    dispatch(cyclePrintJobStatus(job.id));
    if (job.status === PrintStatus.Printing) {
      job.labels.forEach((l) => dispatch(markPrinted(l.id)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Print job</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Queued {job.queuedAt.slice(0, 10)} · by {job.createdBy} · {job.printFormat}
          </p>
        </div>
        <Link href={`/${local}/barcodes`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted shrink-0">
          Back
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[job.status]}`}>
            {job.status}
          </span>
          <span className="text-sm text-muted-foreground">{job.labels.length} labels</span>
        </div>
        {job.status !== PrintStatus.Done && (
          <button
            onClick={advanceAndMarkPrinted}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            {job.status === PrintStatus.Queued ? 'Start printing' : 'Mark as done'}
          </button>
        )}
      </section>

      <section className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-2 border-b bg-muted/40 text-sm font-medium">Labels in this job</div>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/20">
            <tr>
              <th className="p-3 text-start font-medium">Type</th>
              <th className="p-3 text-start font-medium">Entity ID</th>
              <th className="p-3 text-start font-medium">Barcode value</th>
              <th className="p-3 text-start font-medium">Format</th>
              <th className="p-3 text-start font-medium">Printed at</th>
            </tr>
          </thead>
          <tbody>
            {job.labels.map((l) => (
              <tr key={l.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="p-3 text-xs">{l.entityType}</td>
                <td className="p-3 font-mono text-xs">{l.entityId}</td>
                <td className="p-3 font-mono text-xs">{l.barcodeVal}</td>
                <td className="p-3 text-xs">{l.type}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {l.printedAt ? l.printedAt.slice(0, 10) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
