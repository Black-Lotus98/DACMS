'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKpiModule } from '../hooks';
import { KpiTrend } from '../types';

export function KpiRoleDetailPage() {
  const { local, role } = useParams<{ local: string; role: string }>();
  const { getKpisForRole } = useKpiModule();
  const roleKpis = getKpisForRole(role);

  function trendArrow(trend: KpiTrend) {
    if (trend === KpiTrend.Up) return '↑';
    if (trend === KpiTrend.Down) return '↓';
    return '→';
  }

  function trendColor(trend: KpiTrend) {
    if (trend === KpiTrend.Up) return 'text-green-600';
    if (trend === KpiTrend.Down) return 'text-red-600';
    return 'text-muted-foreground';
  }

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
            <div key={k.id} className="rounded-lg border p-3 space-y-1">
              <p className="text-sm text-muted-foreground">{k.nameEn}</p>
              <p className="text-2xl font-bold">
                {k.liveValue}
                <span className="text-base ml-1 text-muted-foreground">{k.unit}</span>
              </p>
              <p className={`text-xs ${trendColor(k.trend)}`}>{trendArrow(k.trend)} {k.trend}</p>
              <p className="text-[11px] text-muted-foreground">
                Target: {k.targetValue ?? 'N/A'} {k.unit}
              </p>
              <div className="pt-1">
                <p className="text-[11px] text-muted-foreground">Last 12 months</p>
                <div className="flex items-end gap-1 h-12">
                  {k.snapshots.slice(-12).map((s) => (
                    <div
                      key={s.id}
                      className="bg-primary/35 w-2 rounded-sm"
                      style={{ height: `${Math.max(8, Math.min(48, s.value))}px` }}
                      title={`${s.period}: ${s.value}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
