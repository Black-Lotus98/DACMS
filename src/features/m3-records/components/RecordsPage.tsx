'use client';

import { useRecordsModule } from '../hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function RecordsPage() {
  const { records, history } = useRecordsModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Records & Archiving</h1>
          <p className="text-sm text-muted-foreground">
            M3: Record registration and location tracking.
          </p>
        </div>
        <Link href={`/${local}/records/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          New record
        </Link>
      </div>
      <div className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">Reference</th><th className="p-3 text-start">Title</th><th className="p-3 text-start">Box</th><th className="p-3 text-start">Secrecy</th><th className="p-3 text-start">Action</th></tr></thead>
          <tbody>{records.map((r)=><tr key={r.id} className="border-b last:border-b-0"><td className="p-3 font-mono">{r.refNo}</td><td className="p-3">{r.title}</td><td className="p-3 font-mono text-xs">{r.boxCode}</td><td className="p-3">{r.secrecy}</td><td className="p-3"><Link href={`/${local}/records/${r.id}`} className="text-primary hover:underline">Details</Link></td></tr>)}</tbody>
        </table>
      </div>
      <section className="rounded-xl border bg-background p-4"><h2 className="font-semibold mb-2">Recent movements</h2><ul className="space-y-2 text-sm">{history.map((h)=><li key={h.id} className="border rounded-md p-2">{h.recordId}: {h.fromBox} → {h.toBox}</li>)}</ul></section>
    </div>
  );
}
