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
          <h1 className="text-2xl font-bold">إدارة الإعارة والطلبات</h1>
          <p className="text-sm text-muted-foreground">M6: دورة الطلب من التقديم حتى الإرجاع.</p>
        </div>
        <Link href={`/${local}/lending/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          طلب إعارة جديد
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr><th className="p-3 text-start">المرجع</th><th className="p-3 text-start">الجهة</th><th className="p-3 text-start">تاريخ الاستحقاق</th><th className="p-3 text-start">الحالة</th><th className="p-3 text-start">الإجراء</th></tr>
          </thead>
          <tbody>{requests.map((r)=><tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.recordRef}</td><td className="p-3">{r.requester}</td><td className="p-3">{r.dueDate}</td><td className="p-3">{r.status}</td><td className="p-3"><Link href={`/${local}/lending/${r.id}`} className="text-primary hover:underline">التفاصيل</Link></td></tr>)}</tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">حركة المراسل</h2>
        <ul className="space-y-2 text-sm">{dispatches.map((d)=><li key={d.id} className="border rounded-md p-2">{d.requestId} - {d.direction} - {d.messengerName}</li>)}</ul>
      </section>
    </div>
  );
}
