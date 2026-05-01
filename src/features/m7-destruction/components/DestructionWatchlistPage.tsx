'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDestructionModule } from '../hooks';

type WatchlistTab = 'list' | 'calendar';

export function DestructionWatchlistPage() {
  const { local } = useParams<{ local: string }>();
  const { watchlistRequests, getItemsByRequestId, getExpiringSoon, getOverdueRecords, getRetentionExpiryReport } = useDestructionModule();
  const [tab, setTab] = useState<WatchlistTab>('list');

  const expiringSoon   = getExpiringSoon();
  const overdueRecords = getOverdueRecords();
  const expiryReport   = getRetentionExpiryReport();

  // Build 6-month calendar starting from current month
  const today = new Date();
  const calendarMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return d.toISOString().slice(0, 7);
  });
  const maxMonthCount = Math.max(1, ...calendarMonths.map((m) => expiryReport.byMonth[m] ?? 0));

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

      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        {(['list', 'calendar'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${tab === t ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'list' ? 'Watchlist' : 'Retention calendar (F7.6)'}
          </button>
        ))}
      </div>

      {tab === 'calendar' && (
        <div className="space-y-4">
          <section className="rounded-xl border bg-background p-4 space-y-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-semibold text-sm">Retention expiry — next 6 months</h2>
              <span className="text-xs text-muted-foreground">{expiryReport.total} records expiring within 90 days</span>
            </div>

            {/* Bar chart by month */}
            <div className="flex items-end gap-3">
              {calendarMonths.map((month) => {
                const count = expiryReport.byMonth[month] ?? 0;
                const heightPct = maxMonthCount > 0 ? Math.round((count / maxMonthCount) * 100) : 0;
                const isOverdue = month < today.toISOString().slice(0, 7);
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{count}</span>
                    <div className="w-full bg-muted rounded-t" style={{ height: '80px', position: 'relative' }}>
                      <div
                        className={`w-full rounded-t absolute bottom-0 ${isOverdue ? 'bg-red-400' : count > 0 ? 'bg-amber-400' : 'bg-muted-foreground/20'}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Red = overdue · Amber = upcoming expiry · Grey = no records</p>
          </section>

          {/* Records expiring soon, grouped by month */}
          {expiringSoon.length > 0 && (
            <section className="rounded-xl border bg-background overflow-hidden">
              <div className="px-4 py-2 border-b text-sm font-medium">Records expiring within 90 days</div>
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="p-3 text-start font-medium">Month</th>
                    <th className="p-3 text-start font-medium">Reference</th>
                    <th className="p-3 text-start font-medium">Title</th>
                    <th className="p-3 text-start font-medium">Retention end</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringSoon
                    .slice()
                    .sort((a, b) => a.retentionEnd.localeCompare(b.retentionEnd))
                    .map((r) => (
                      <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="p-3 text-xs text-muted-foreground">{r.retentionEnd.slice(0, 7)}</td>
                        <td className="p-3 font-mono text-xs">{r.refNo}</td>
                        <td className="p-3 text-xs">{r.titleEn}</td>
                        <td className="p-3 text-xs text-amber-700">{r.retentionEnd}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </section>
          )}
        </div>
      )}

      {tab === 'list' && (
        <div className="space-y-4">
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
      )}
    </div>
  );
}
