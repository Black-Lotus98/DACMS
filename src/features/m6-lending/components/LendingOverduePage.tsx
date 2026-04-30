'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLendingModule } from '../hooks';

export function LendingOverduePage() {
  const { local } = useParams<{ local: string }>();
  const { overdueRequests, getItemsByRequestId } = useLendingModule();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Overdue lending requests</h1>
          <p className="text-sm text-muted-foreground">
            {overdueRequests.length} request{overdueRequests.length !== 1 ? 's' : ''} past due date.
          </p>
        </div>
        <Link href={`/${local}/lending`} className="inline-flex h-9 px-4 items-center rounded-md border text-sm hover:bg-muted">
          Back to lending
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start font-medium">Ref No.</th>
              <th className="p-3 text-start font-medium">Requester</th>
              <th className="p-3 text-start font-medium">Department</th>
              <th className="p-3 text-start font-medium">Due date</th>
              <th className="p-3 text-start font-medium">Items</th>
              <th className="p-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {overdueRequests.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={6}>No overdue requests right now.</td>
              </tr>
            ) : (
              overdueRequests.map((r) => {
                const items = getItemsByRequestId(r.id);
                return (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{r.refNo}</td>
                    <td className="p-3 text-xs">{r.requesterId}</td>
                    <td className="p-3 text-xs">{r.deptId}</td>
                    <td className="p-3 text-xs text-red-600 font-medium">{r.dueDate}</td>
                    <td className="p-3 text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                    <td className="p-3">
                      <Link href={`/${local}/lending/${r.id}`} className="text-primary hover:underline text-xs">
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
