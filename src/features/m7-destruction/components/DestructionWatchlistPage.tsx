'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDestructionModule } from '../hooks';

export function DestructionWatchlistPage() {
  const { local } = useParams<{ local: string }>();
  const { watchlistRequests, getItemsByRequestId, getExpiringSoon, getOverdueRecords } = useDestructionModule();

  const expiringSoon   = getExpiringSoon();
  const overdueRecords = getOverdueRecords();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Destruction watchlist</h1>
          <p className="text-sm text-muted-foreground">
            Records flagged for destruction and those approaching retention expiry.
          </p>
        </div>
        <Link href={`/${local}/destruction`} className="inline-flex h-9 px-4 items-center rounded-md border text-sm hover:bg-muted">
          Back
        </Link>
      </div>

      {overdueRecords.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-sm text-red-800 mb-2">
            {overdueRecords.length} record{overdueRecords.length !== 1 ? 's' : ''} past retention end date
          </h2>
          <ul className="space-y-1 text-sm">
            {overdueRecords.map((r) => (
              <li key={r.id} className="flex items-center gap-3 text-xs">
                <span className="font-mono">{r.refNo}</span>
                <span className="flex-1">{r.titleEn}</span>
                <span className="text-red-600 font-medium">Expired: {r.retentionEnd}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {expiringSoon.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="font-semibold text-sm text-amber-800 mb-2">
            {expiringSoon.length} record{expiringSoon.length !== 1 ? 's' : ''} expiring within 90 days
          </h2>
          <ul className="space-y-1 text-sm">
            {expiringSoon.map((r) => (
              <li key={r.id} className="flex items-center gap-3 text-xs">
                <span className="font-mono">{r.refNo}</span>
                <span className="flex-1">{r.titleEn}</span>
                <span className="text-amber-700">Expires: {r.retentionEnd}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border bg-background overflow-x-auto">
        <div className="px-4 py-2 border-b text-sm font-medium">Pending & under review requests</div>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start font-medium">Ref No.</th>
              <th className="p-3 text-start font-medium">Requester</th>
              <th className="p-3 text-start font-medium">Items</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {watchlistRequests.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>No pending requests.</td>
              </tr>
            ) : (
              watchlistRequests.map((r) => {
                const items = getItemsByRequestId(r.id);
                return (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{r.refNo}</td>
                    <td className="p-3 text-xs">{r.requesterId}</td>
                    <td className="p-3 text-xs text-muted-foreground">{items.length}</td>
                    <td className="p-3 text-xs">{r.status}</td>
                    <td className="p-3">
                      <Link href={`/${local}/destruction/${r.id}`} className="text-primary hover:underline text-xs">
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
