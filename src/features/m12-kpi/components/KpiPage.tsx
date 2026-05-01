'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { ROLE_LABELS, type RoleType } from '@/config/roles';
import { useKpiModule } from '../hooks';
import type { KpiWithValue } from '../hooks';
import { updateTargetValue } from '../store/slice';
import { KpiGroup, KpiTrend } from '../types';

const GROUP_LABELS: Record<KpiGroup, string> = {
  [KpiGroup.Operational]: 'Operational',
  [KpiGroup.Lending]:     'Lending',
  [KpiGroup.Storage]:     'Storage',
  [KpiGroup.Destruction]: 'Destruction',
  [KpiGroup.Governance]:  'Governance',
};

function trendArrow(trend: KpiTrend) {
  if (trend === KpiTrend.Up)   return '↑';
  if (trend === KpiTrend.Down) return '↓';
  return '→';
}

function trafficClass(color: 'green' | 'yellow' | 'red') {
  if (color === 'green')  return 'bg-green-100 text-green-800 border-green-200';
  if (color === 'yellow') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

function trendColorClass(trend: KpiTrend, higherIsBetter: boolean) {
  if (trend === KpiTrend.Stable) return 'text-muted-foreground';
  const good = trend === KpiTrend.Up ? higherIsBetter : !higherIsBetter;
  return good ? 'text-green-600' : 'text-red-600';
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-px h-7 mt-2" title="12-month trend">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-primary/25"
          style={{ height: `${Math.max(8, ((v - min) / range) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function KpiCard({ kpi, onEdit }: { kpi: KpiWithValue; onEdit: (id: string, current?: number) => void }) {
  const displayValue =
    kpi.unit === '%'
      ? kpi.liveValue.toFixed(1)
      : kpi.unit === 'days'
        ? kpi.liveValue.toFixed(1)
        : Math.round(kpi.liveValue).toString();

  return (
    <div className={`rounded-lg border p-4 space-y-2 ${trafficClass(kpi.trafficLight)}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] opacity-60 leading-none">{kpi.nameAr}</p>
          <p className="text-sm font-semibold leading-tight mt-0.5">{kpi.nameEn}</p>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${trafficClass(kpi.trafficLight)}`}>
          {kpi.trafficLight}
        </span>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold leading-none">{displayValue}</span>
        <span className="text-sm opacity-60 mb-0.5">{kpi.unit}</span>
        <span className={`text-lg font-bold ml-auto mb-0.5 ${trendColorClass(kpi.trend, kpi.higherIsBetter)}`}>
          {trendArrow(kpi.trend)}
        </span>
      </div>

      {kpi.targetValue !== undefined && (
        <div className="flex items-center justify-between text-xs opacity-70">
          <span>Target: {kpi.targetValue}{kpi.unit}</span>
          <button onClick={() => onEdit(kpi.id, kpi.targetValue)} className="hover:underline">
            Edit
          </button>
        </div>
      )}

      <Sparkline values={kpi.snapshots.map((s) => s.value)} />
      <p className="text-[10px] opacity-40">12-month history · F12.7</p>
    </div>
  );
}

export function KpiPage() {
  const { local } = useParams<{ local: string }>();
  const dispatch   = useDispatch();
  const activeRole = useAppSelector((s) => s.auth.role);

  const { enriched, mappings, getByGroup, getKpisForRole } = useKpiModule();

  const [groupFilter,  setGroupFilter]  = useState<KpiGroup | 'ALL'>('ALL');
  const [roleFilter,   setRoleFilter]   = useState<string>(activeRole ?? 'all');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editValue,    setEditValue]    = useState<string>('');

  const roleOptions = Array.from(new Set(mappings.map((m) => m.role)));

  const flatVisible: KpiWithValue[] =
    roleFilter !== 'all'
      ? getKpisForRole(roleFilter)
      : groupFilter !== 'ALL'
        ? getByGroup(groupFilter)
        : enriched;

  const groupedSections =
    groupFilter === 'ALL' && roleFilter === 'all'
      ? Object.values(KpiGroup)
          .map((g) => ({ group: g, items: enriched.filter((k) => k.group === g) }))
          .filter((s) => s.items.length > 0)
      : [{ group: null as KpiGroup | null, items: flatVisible }];

  function openEdit(id: string, current?: number) {
    setEditingId(id);
    setEditValue(current?.toString() ?? '');
  }

  function saveTarget() {
    if (!editingId) return;
    const v = parseFloat(editValue);
    if (!Number.isNaN(v)) dispatch(updateTargetValue({ id: editingId, targetValue: v }));
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">KPI Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            F12.1–F12.5 groups · F12.6 traffic-light vs target · F12.7 trend history
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setGroupFilter('ALL'); }}
          className="h-9 rounded-md border px-3 text-sm bg-background"
        >
          <option value="all">All roles</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r as RoleType] ?? r}</option>
          ))}
        </select>

        {roleFilter === 'all' && (
          <div className="flex flex-wrap gap-1">
            {(['ALL', ...Object.values(KpiGroup)] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className={`h-9 px-3 rounded-md border text-sm transition-colors ${
                  groupFilter === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted'
                }`}
              >
                {g === 'ALL' ? 'All' : GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        )}

        {roleFilter !== 'all' && (
          <Link
            href={`/${local}/kpi/role/${roleFilter}`}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center gap-1"
          >
            Focused view for {ROLE_LABELS[roleFilter as RoleType] ?? roleFilter} →
          </Link>
        )}
      </div>

      {/* KPI sections */}
      {groupedSections.map(({ group, items }) => (
        <section key={group ?? 'flat'} className="space-y-3">
          {group && (
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {GROUP_LABELS[group]}
            </h2>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((k) => (
              <KpiCard key={k.id} kpi={k} onEdit={openEdit} />
            ))}
          </div>
        </section>
      ))}

      {flatVisible.length === 0 && (
        <p className="text-sm text-muted-foreground">No KPIs match the selected filters.</p>
      )}

      {/* Edit target dialog */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-xl border shadow-xl p-6 w-80 space-y-4">
            <h3 className="font-semibold">Update Target Value</h3>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-9 rounded-md border px-3 text-sm"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="h-9 px-4 rounded-md border text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={saveTarget}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
