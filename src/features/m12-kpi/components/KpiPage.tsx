'use client';

import { useMemo, useState } from 'react';
import { useKpiModule } from '../hooks';

export function KpiPage() {
  const { kpis, mappings, getKpisForRole } = useKpiModule();
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const roleOptions = useMemo(
    () => Array.from(new Set(mappings.map((m) => m.role))),
    [mappings]
  );

  const visibleKpis =
    selectedRole === 'all' ? kpis : getKpisForRole(selectedRole);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مؤشرات الأداء</h1>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="all">all roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        عرض المؤشرات حسب الربط في وحدة M15.
      </p>

      <div className="grid md:grid-cols-3 gap-3">
        {visibleKpis.map((k) => (
          <div key={k.id} className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">{k.label}</p>
            <p className="text-2xl font-bold">{k.value}</p>
            <p className={`text-xs ${k.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {k.trend >= 0 ? '+' : ''}
              {k.trend}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
