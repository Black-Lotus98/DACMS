'use client';

import { useMemo, useState } from 'react';
import { useKpiLinkingModule } from '../hooks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { upsertMapping } from '../store/slice';

export function KpiLinkingPage() {
  const dispatch = useAppDispatch();
  const { mappings } = useKpiLinkingModule();
  const kpis = useAppSelector((s) => s.kpi.definitions);
  const [selectedRole, setSelectedRole] = useState(mappings[0]?.role ?? 'center_director');

  const activeMapping = useMemo(
    () => mappings.find((m) => m.role === selectedRole),
    [mappings, selectedRole]
  );

  function toggleKpiKey(kpiKey: string) {
    const currentKeys = activeMapping?.kpiKeys ?? [];
    const nextKeys = currentKeys.includes(kpiKey)
      ? currentKeys.filter((k) => k !== kpiKey)
      : [...currentKeys, kpiKey];

    dispatch(
      upsertMapping({
        id: activeMapping?.id ?? `map-${Date.now()}`,
        role: selectedRole,
        kpiKeys: nextKeys,
      })
    );
  }

  const roleOptions = Array.from(new Set(mappings.map((m) => m.role)));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ربط الهيكل بمؤشرات الأداء</h1>

      <section className="rounded-lg border bg-background p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">الدور:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {kpis.map((kpi) => {
            const checked = activeMapping?.kpiKeys.includes(kpi.key) ?? false;
            return (
              <label key={kpi.id} className="flex items-center gap-2 border rounded-md p-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleKpiKey(kpi.key)}
                />
                <span>{kpi.label}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border bg-background p-4 space-y-2">
        <h2 className="font-semibold text-sm">الحالة الحالية</h2>
        {mappings.map((m) => (
          <div key={m.id} className="border rounded p-2 text-sm">
            <span className="font-medium">{m.role}</span>: {m.kpiKeys.join(', ')}
          </div>
        ))}
      </section>
    </div>
  );
}
