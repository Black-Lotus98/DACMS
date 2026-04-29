'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLendingModule } from '../hooks';

export function LendingOverduePage() {
  const { local } = useParams<{ local: string }>();
  const { overdueRequests } = useLendingModule();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Overdue lending requests</h1>
          <p className="text-sm text-muted-foreground">Track items that passed their due date and still need return processing.</p>
        </div>
        <Link href={`/${local}/lending`} className="inline-flex h-9 px-4 items-center rounded-md border text-sm hover:bg-muted">
          Back to lending
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start">Reference</th>
              <th className="p-3 text-start">Department</th>
              <th className="p-3 text-start">Due date</th>
              <th className="p-3 text-start">Status</th>
              <th className="p-3 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueRequests.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>No overdue requests right now.</td>
              </tr>
            ) : (
              overdueRequests.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3 font-mono">{r.recordRef}</td>
                  <td className="p-3">{r.requester}</td>
                  <td className="p-3">{r.dueDate}</td>
                  <td className="p-3 capitalize">{r.status}</td>
                  <td className="p-3">
                    <Link href={`/${local}/lending/${r.id}`} className="text-primary hover:underline">Details</Link>
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
