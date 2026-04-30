'use client';

import { useLendingModule } from '../hooks';
import { LendingStatus } from '../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const STATUS_COLOR: Record<LendingStatus, string> = {
  [LendingStatus.Pending]:    'bg-amber-100 text-amber-700',
  [LendingStatus.Approved]:   'bg-blue-100 text-blue-700',
  [LendingStatus.Rejected]:   'bg-red-100 text-red-700',
  [LendingStatus.Dispatched]: 'bg-purple-100 text-purple-700',
  [LendingStatus.Active]:     'bg-green-100 text-green-700',
  [LendingStatus.Returned]:   'bg-muted text-muted-foreground',
  [LendingStatus.Overdue]:    'bg-red-100 text-red-700',
};

export function LendingPage() {
  const { requests, dispatches } = useLendingModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lending & Requests</h1>
          <p className="text-sm text-muted-foreground">Request lifecycle from submission to return.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${local}/lending/overdue`} className="inline-flex h-9 px-3 items-center rounded-md border text-sm hover:bg-muted">
            Overdue
          </Link>
          <Link href={`/${local}/lending/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
            New request
          </Link>
        </div>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start font-medium">Ref No.</th>
              <th className="p-3 text-start font-medium">Requester</th>
              <th className="p-3 text-start font-medium">Department</th>
              <th className="p-3 text-start font-medium">Due date</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">{r.refNo}</td>
                <td className="p-3 text-xs">{r.requesterId}</td>
                <td className="p-3 text-xs">{r.deptId}</td>
                <td className="p-3 text-xs text-muted-foreground">{r.dueDate ?? '—'}</td>
                <td className="p-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/${local}/lending/${r.id}`} className="text-primary hover:underline text-xs">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3 text-sm">Messenger dispatches</h2>
        {dispatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No dispatches recorded.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {dispatches.map((d) => (
              <li key={d.id} className="border rounded-md p-2 flex items-center gap-3 text-xs">
                <span className="font-mono text-muted-foreground">{d.requestId}</span>
                <span className={`px-1.5 py-0.5 rounded font-medium ${d.direction === 'OUTBOUND' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {d.direction}
                </span>
                <span>Messenger: {d.messengerId}</span>
                <span className="text-muted-foreground ml-auto">{d.dispatchedAt.slice(0, 10)}</span>
                {d.confirmedAt && <span className="text-green-600">Confirmed</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
