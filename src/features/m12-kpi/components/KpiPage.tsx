'use client';

import { useMemo, useState } from 'react';
import { useKpiModule } from '../hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ROLE_LABELS, type RoleType } from '@/config/roles';
import { KpiTrend } from '../types';

export function KpiPage() {
  const { enriched, mappings, getKpisForRole } = useKpiModule();
  const activeRole = useAppSelector((s) => s.auth.role);
  const [selectedRole, setSelectedRole] = useState<string>(activeRole ?? 'all');
  const { local } = useParams<{ local: string }>();

  const roleOptions = useMemo(
    () => Array.from(new Set(mappings.map((m) => m.role))),
    [mappings]
  );

  const visibleKpis =
    selectedRole === 'all' ? enriched : getKpisForRole(selectedRole);

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

  function trafficClass(color: 'green' | 'yellow' | 'red') {
    if (color === 'green') return 'bg-green-100 text-green-800';
    if (color === 'yellow') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">KPI Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Current value, trend, and target comparison (F12.6).
          </p>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="all">all roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role as RoleType] ?? role}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        Role-filtered view based on M15 mappings (F12.1-F12.5, F12.7).
      </p>
      {selectedRole !== 'all' && (
        <div>
          <Link href={`/${local}/kpi/role/${selectedRole}`} className="text-sm text-primary hover:underline">
            Open focused view for `{selectedRole}`
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        {visibleKpis.map((k) => (
          <div key={k.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{k.nameEn}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${trafficClass(k.trafficLight)}`}>
                {k.trafficLight}
              </span>
            </div>
            <p className="text-2xl font-bold">
              {k.liveValue}
              <span className="text-base ml-1 text-muted-foreground">{k.unit}</span>
            </p>
            <p className={`text-xs ${trendColor(k.trend)}`}>
              {trendArrow(k.trend)} {k.trend}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Target: {k.targetValue ?? 'N/A'} {k.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
