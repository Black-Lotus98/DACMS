'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ROLE_LABELS, type RoleType } from '@/config/roles';
import { useKpiModule } from '../hooks';
import type { KpiWithValue } from '../hooks';
import { KpiGroup, KpiTrend } from '../types';

const GROUP_LABELS: Record<KpiGroup, string> = {
  [KpiGroup.Operational]: 'Operational',
  [KpiGroup.Lending]:     'Lending',
  [KpiGroup.Storage]:     'Storage',
  [KpiGroup.Destruction]: 'Destruction',
  [KpiGroup.Governance]:  'Governance',
};

function trafficCardClass(c: 'green' | 'yellow' | 'red') {
  if (c === 'green')  return 'border-green-200 bg-green-50/40';
  if (c === 'yellow') return 'border-yellow-200 bg-yellow-50/40';
  return 'border-red-200 bg-red-50/40';
}

function trafficDot(c: 'green' | 'yellow' | 'red') {
  if (c === 'green')  return 'bg-green-500';
  if (c === 'yellow') return 'bg-yellow-400';
  return 'bg-red-500';
}

function trendArrow(trend: KpiTrend) {
  if (trend === KpiTrend.Up)   return '↑';
  if (trend === KpiTrend.Down) return '↓';
  return '→';
}

function trendColor(trend: KpiTrend, higherIsBetter: boolean) {
  if (trend === KpiTrend.Stable) return 'text-muted-foreground';
  return (trend === KpiTrend.Up) === higherIsBetter ? 'text-green-600' : 'text-red-600';
}

function Sparkline({ kpi }: { kpi: KpiWithValue }) {
  const snaps = kpi.snapshots.slice(-12);
  if (snaps.length < 2) return null;
  const values = snaps.map((s) => s.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return (
    <div className="pt-2">
      <p className="text-[11px] text-muted-foreground mb-1">12-month trend (F12.7)</p>
      <div className="flex items-end gap-px h-10">
        {snaps.map((s, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/30"
            style={{ height: `${Math.max(8, ((s.value - min) / range) * 100)}%` }}
            title={`${s.period}: ${s.value}${kpi.unit}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
        <span>{snaps[0]?.period}</span>
        <span>{snaps[snaps.length - 1]?.period}</span>
      </div>
    </div>
  );
}

function KpiDetailCard({ kpi }: { kpi: KpiWithValue }) {
  const displayValue =
    kpi.unit === '%' || kpi.unit === 'days'
      ? kpi.liveValue.toFixed(1)
      : Math.round(kpi.liveValue).toString();

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${trafficCardClass(kpi.trafficLight)}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] opacity-60">{kpi.nameAr}</p>
          <p className="font-semibold">{kpi.nameEn}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.formula}</p>
        </div>
        <span className={`h-3 w-3 rounded-full shrink-0 mt-1 ${trafficDot(kpi.trafficLight)}`} />
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold leading-none">{displayValue}</span>
        <span className="text-sm text-muted-foreground mb-0.5">{kpi.unit}</span>
        <span className={`text-base font-bold ml-auto mb-0.5 ${trendColor(kpi.trend, kpi.higherIsBetter)}`}>
          {trendArrow(kpi.trend)} {kpi.trend}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Target: <strong>{kpi.targetValue ?? 'N/A'}{kpi.unit}</strong>
        {' · '}{kpi.higherIsBetter ? 'Higher is better' : 'Lower is better'}
      </p>

      <Sparkline kpi={kpi} />
    </div>
  );
}

export function KpiRoleDetailPage() {
  const { local, role } = useParams<{ local: string; role: string }>();
  const { getKpisForRole } = useKpiModule();
  const roleKpis  = getKpisForRole(role);
  const roleLabel = ROLE_LABELS[role as RoleType] ?? role;

  const byGroup = Object.values(KpiGroup)
    .map((g) => ({ group: g, items: roleKpis.filter((k) => k.group === g) }))
    .filter((s) => s.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">KPI View: {roleLabel}</h1>
          <p className="text-sm text-muted-foreground">
            {roleKpis.length} indicator{roleKpis.length !== 1 ? 's' : ''} · role-scoped via M15 mapping
          </p>
        </div>
        <Link
          href={`/${local}/kpi`}
          className="h-9 px-4 rounded-md border text-sm hover:bg-muted inline-flex items-center shrink-0"
        >
          ← KPI Dashboard
        </Link>
      </div>

      {roleKpis.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No KPI mappings configured for this role. Set them up in the KPI Linking module (M15).
        </div>
      ) : (
        byGroup.map(({ group, items }) => (
          <section key={group} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {GROUP_LABELS[group]}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((k) => <KpiDetailCard key={k.id} kpi={k} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
