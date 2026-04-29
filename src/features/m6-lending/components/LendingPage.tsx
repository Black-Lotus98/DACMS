'use client';

import { useLendingModule } from '../hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function LendingPage() {
  const { requests, dispatches } = useLendingModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lending & Requests</h1>
          <p className="text-sm text-muted-foreground">M6: دورة الطلب من التقديم حتى الReturn.</p>
        </div>
        <Link href={`/${local}/lending/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          New lending request
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr><th className="p-3 text-start">Reference</th><th className="p-3 text-start">Department</th><th className="p-3 text-start">تاريخ Due date</th><th className="p-3 text-start">Status</th><th className="p-3 text-start">الإجراء</th></tr>
          </thead>
          <tbody>{requests.map((r)=><tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.recordRef}</td><td className="p-3">{r.requester}</td><td className="p-3">{r.dueDate}</td><td className="p-3">{r.status}</td><td className="p-3"><Link href={`/${local}/lending/${r.id}`} className="text-primary hover:underline">Details</Link></td></tr>)}</tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Messenger dispatches</h2>
        <ul className="space-y-2 text-sm">{dispatches.map((d)=><li key={d.id} className="border rounded-md p-2">{d.requestId} - {d.direction} - {d.messengerName}</li>)}</ul>
      </section>
    </div>
  );
}
