'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useReportsModule } from '../hooks';
import { setActiveReport } from '../store/slice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function ReportsPage() {
  const dispatch = useAppDispatch();
  const { definitions, activeReportId } = useReportsModule();
  const { local } = useParams<{ local: string }>();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(definitions.map((d) => d.category)))],
    [definitions]
  );

  const visibleReports = useMemo(
    () =>
      definitions.filter((r) =>
        categoryFilter === 'all' ? true : r.category === categoryFilter
      ),
    [definitions, categoryFilter]
  );

  const activeReport = definitions.find((d) => d.id === activeReportId) ?? null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports & Statistics</h1>

      <section className="rounded-lg border bg-background p-3 flex flex-wrap items-center gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-md border px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'quarter')}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="week">last week</option>
          <option value="month">last month</option>
          <option value="quarter">last quarter</option>
        </select>
        <span className="text-xs text-muted-foreground">
          applied period: {period}
        </span>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        {visibleReports.map((r) => (
          <div
            key={r.id}
            className={`rounded-lg border p-3 ${
              activeReportId === r.id ? 'border-primary-a0' : ''
            }`}
          >
            <button
              onClick={() => dispatch(setActiveReport(r.id))}
              className="text-start hover:bg-muted/40 rounded-md w-full p-1"
            >
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.category}</p>
            </button>
            <Link href={`/${local}/reports/${r.id}`} className="text-xs text-primary hover:underline mt-2 inline-block">
              Open report view
            </Link>
          </div>
        ))}
      </div>

      {activeReport && (
        <section className="rounded-lg border bg-background p-4">
          <h2 className="font-semibold">{activeReport.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Preview for {activeReport.category} report using {period} range.
          </p>
        </section>
      )}
    </div>
  );
}
