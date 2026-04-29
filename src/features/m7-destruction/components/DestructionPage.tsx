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
          <h1 className="text-2xl font-bold">Destruction & Migration</h1>
          <p className="text-sm text-muted-foreground">M7: قائمة المراقبة، سلسلة الApprove، وMigration requests.</p>
        </div>
        <Link href={`/${local}/destruction/new`} className="inline-flex h-9 px-4 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium">
          New destruction request
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">Reference</th><th className="p-3 text-start">Reason</th><th className="p-3 text-start">مستوى الApprove</th><th className="p-3 text-start">Status</th><th className="p-3 text-start">الإجراء</th></tr></thead>
          <tbody>{requests.map((r)=><tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.recordRef}</td><td className="p-3">{r.reason}</td><td className="p-3">{r.approvalLevel}/3</td><td className="p-3">{r.status}</td><td className="p-3"><Link href={`/${local}/destruction/${r.id}`} className="text-primary hover:underline">Details</Link></td></tr>)}</tbody>
        </table>
      </section>

      <section className="rounded-xl border bg-background p-4"><h2 className="font-semibold mb-2">Migration requests</h2><ul className="space-y-2 text-sm">{migrations.map((m)=><li key={m.id} className="border rounded-md p-2">{m.recordRef} → {m.target} ({m.type})</li>)}</ul></section>
    </div>
  );
}
