'use client';

import { useRecordsModule } from '../hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const SECRECY_COLOR: Record<string, string> = {
  PUBLIC:    'bg-green-100 text-green-700',
  INTERNAL:  'bg-blue-100 text-blue-700',
  SECRET:    'bg-amber-100 text-amber-700',
  TOP_SECRET:'bg-red-100 text-red-700',
};

export function RecordsPage() {
  const { records, history } = useRecordsModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Records & Archiving</h1>
          <p className="text-sm text-muted-foreground">Record registration and location tracking.</p>
        </div>
        <Link
          href={`/${local}/records/new`}
          className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium"
        >
          New record
        </Link>
      </div>

      <div className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start font-medium">Reference</th>
              <th className="p-3 text-start font-medium">Title (AR)</th>
              <th className="p-3 text-start font-medium">Title (EN)</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-start font-medium">Secrecy</th>
              <th className="p-3 text-start font-medium">Archive date</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">{r.refNo}</td>
                <td className="p-3" dir="rtl">{r.titleAr}</td>
                <td className="p-3">{r.titleEn}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SECRECY_COLOR[r.secrecy] ?? ''}`}>
                    {r.secrecy}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{r.archiveDate}</td>
                <td className="p-3">
                  <Link href={`/${local}/records/${r.id}`} className="text-primary hover:underline text-xs">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Recent movements</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No movements recorded.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="border rounded-md p-2 flex items-start gap-3">
                <span className="font-mono text-xs text-muted-foreground">{h.movedAt.slice(0, 10)}</span>
                <span>{h.fromBox} → {h.toBox}</span>
                <span className="text-muted-foreground text-xs ml-auto">{h.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
