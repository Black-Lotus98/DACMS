'use client';

import { useDestructionModule } from '../hooks';
import { DestructionStatus, MigrationStatus } from '../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const STATUS_COLOR: Record<DestructionStatus, string> = {
  [DestructionStatus.Pending]:     'bg-amber-100 text-amber-700',
  [DestructionStatus.LegalReview]: 'bg-blue-100 text-blue-700',
  [DestructionStatus.Approved]:    'bg-green-100 text-green-700',
  [DestructionStatus.Rejected]:    'bg-red-100 text-red-700',
  [DestructionStatus.Executed]:    'bg-muted text-muted-foreground',
};

const MIG_STATUS_COLOR: Record<MigrationStatus, string> = {
  [MigrationStatus.Pending]:    'bg-amber-100 text-amber-700',
  [MigrationStatus.Approved]:   'bg-blue-100 text-blue-700',
  [MigrationStatus.InProgress]: 'bg-purple-100 text-purple-700',
  [MigrationStatus.Completed]:  'bg-green-100 text-green-700',
};

export function DestructionPage() {
  const { requests, migrations, getItemsByRequestId, getExpiringSoon } = useDestructionModule();
  const { local } = useParams<{ local: string }>();
  const expiringSoon = getExpiringSoon();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Destruction & Migration</h1>
          <p className="text-sm text-muted-foreground">Watchlist, approval chain, and migration requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${local}/destruction/watchlist`} className="inline-flex h-9 px-3 items-center rounded-md border text-sm hover:bg-muted">
            Watchlist
          </Link>
          <Link href={`/${local}/destruction/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
            New request
          </Link>
        </div>
      </div>

      {expiringSoon.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          {expiringSoon.length} record{expiringSoon.length !== 1 ? 's' : ''} approaching retention expiry within 90 days.
        </div>
      )}

      <section className="rounded-xl border bg-background overflow-x-auto">
        <div className="px-4 py-2 border-b text-sm font-medium">Destruction requests</div>
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
            {requests.map((r) => {
              const items = getItemsByRequestId(r.id);
              return (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{r.refNo}</td>
                  <td className="p-3 text-xs">{r.requesterId}</td>
                  <td className="p-3 text-xs text-muted-foreground">{items.length}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/${local}/destruction/${r.id}`} className="text-primary hover:underline text-xs">
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold text-sm mb-3">Migration requests</h2>
        {migrations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No migration requests.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {migrations.map((m) => (
              <li key={m.id} className="border rounded-md p-2 flex items-center gap-3">
                <span className="font-mono text-xs">{m.refNo}</span>
                <span className="flex-1">{m.destination}</span>
                <span className="text-xs text-muted-foreground">{m.type}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${MIG_STATUS_COLOR[m.status]}`}>
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
