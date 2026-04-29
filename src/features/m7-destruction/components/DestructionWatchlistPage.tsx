'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDestructionModule } from '../hooks';

export function DestructionWatchlistPage() {
  const { local } = useParams<{ local: string }>();
  const { watchlistRequests } = useDestructionModule();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Destruction watchlist</h1>
          <p className="text-sm text-muted-foreground">Review records flagged for destruction before approval chain processing starts.</p>
        </div>
        <Link href={`/${local}/destruction`} className="inline-flex h-9 px-4 items-center rounded-md border text-sm hover:bg-muted">
          Back to destruction
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start">Reference</th>
              <th className="p-3 text-start">Reason</th>
              <th className="p-3 text-start">Approval level</th>
              <th className="p-3 text-start">Status</th>
              <th className="p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {watchlistRequests.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>No watchlist records right now.</td>
              </tr>
            ) : (
              watchlistRequests.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3 font-mono">{r.recordRef}</td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">{r.approvalLevel}/3</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    <Link href={`/${local}/destruction/${r.id}`} className="text-primary hover:underline">Details</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
