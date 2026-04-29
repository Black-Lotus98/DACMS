'use client';

import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'next/navigation';
import { useBarcodesModule } from '../hooks';
import { cyclePrintJobStatus } from '../store/slice';

export function PrintJobDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getPrintJobById } = useBarcodesModule();
  const job = getPrintJobById(id);

  if (!job) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Print job not found</h1>
        <p className="text-sm text-muted-foreground">This print job id does not exist.</p>
        <Link href={`/${local}/barcodes`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to barcodes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Print job: {job.title}</h1>
          <p className="text-sm text-muted-foreground">Track and advance this print job state.</p>
        </div>
        <Link href={`/${local}/barcodes`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to barcodes
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <div className="text-sm">Labels count: <span className="font-medium">{job.count}</span></div>
        <div className="text-sm">Current status: <span className="font-medium">{job.status}</span></div>
        <button onClick={() => dispatch(cyclePrintJobStatus(job.id))} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
          Advance to next status
        </button>
      </section>
    </div>
  );
}
