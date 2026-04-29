'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKpiModule } from '../hooks';

export function KpiRoleDetailPage() {
  const { local, role } = useParams<{ local: string; role: string }>();
  const { getKpisForRole } = useKpiModule();
  const roleKpis = getKpisForRole(role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">KPI view: {role}</h1>
          <p className="text-sm text-muted-foreground">Focused KPI route for a single role mapping.</p>
        </div>
        <Link href={`/${local}/kpi`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to KPI dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {roleKpis.length === 0 ? (
          <div className="rounded-lg border p-3 text-sm text-muted-foreground">No KPI mappings found for this role.</div>
        ) : (
          roleKpis.map((k) => (
            <div key={k.id} className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className={`text-xs ${k.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {k.trend >= 0 ? '+' : ''}
                {k.trend}%
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
