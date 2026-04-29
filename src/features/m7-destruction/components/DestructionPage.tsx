'use client';

import { useDestructionModule } from '../hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function DestructionPage() {
  const { requests, migrations } = useDestructionModule();
  const { local } = useParams<{ local: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">الإتلاف والترحيل</h1>
          <p className="text-sm text-muted-foreground">M7: قائمة المراقبة، سلسلة الاعتماد، وطلبات الترحيل.</p>
        </div>
        <Link href={`/${local}/destruction/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          طلب إتلاف جديد
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">المرجع</th><th className="p-3 text-start">السبب</th><th className="p-3 text-start">مستوى الاعتماد</th><th className="p-3 text-start">الحالة</th><th className="p-3 text-start">الإجراء</th></tr></thead>
          <tbody>{requests.map((r)=><tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.recordRef}</td><td className="p-3">{r.reason}</td><td className="p-3">{r.approvalLevel}/3</td><td className="p-3">{r.status}</td><td className="p-3"><Link href={`/${local}/destruction/${r.id}`} className="text-primary hover:underline">التفاصيل</Link></td></tr>)}</tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4"><h2 className="font-semibold mb-2">طلبات الترحيل</h2><ul className="space-y-2 text-sm">{migrations.map((m)=><li key={m.id} className="border rounded-md p-2">{m.recordRef} → {m.target} ({m.type})</li>)}</ul></section>
    </div>
  );
}
