'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setActiveReport } from '../store/slice';
import { useReportsModule } from '../hooks';
import { ReportType } from '../types';

const TYPE_META: Record<ReportType, { en: string; ar: string; color: string; req: string }> = {
  [ReportType.Transfers]:    { en: 'Transfers',        ar: 'نقل السجلات',          color: 'bg-blue-100 text-blue-800',   req: 'F9.1' },
  [ReportType.Lending]:      { en: 'Lending Activity', ar: 'نشاط الإعارة',          color: 'bg-green-100 text-green-800', req: 'F9.2' },
  [ReportType.Destruction]:  { en: 'Destruction',      ar: 'الإتلاف والترحيل',      color: 'bg-red-100 text-red-800',     req: 'F9.3' },
  [ReportType.Inventory]:    { en: 'Inventory',        ar: 'جرد السجلات',           color: 'bg-purple-100 text-purple-800', req: 'F9.4' },
  [ReportType.Capacity]:     { en: 'Capacity',         ar: 'سعة التخزين',           color: 'bg-orange-100 text-orange-800', req: 'F9.5' },
  [ReportType.UserActivity]: { en: 'User Activity',    ar: 'نشاط المستخدمين',       color: 'bg-gray-100 text-gray-800',   req: 'F9.6' },
  [ReportType.Overdue]:      { en: 'Overdue',          ar: 'الإعارات المتأخرة',     color: 'bg-yellow-100 text-yellow-800', req: 'F9.7' },
  [ReportType.Expiry]:       { en: 'Expiry',           ar: 'انتهاء الاحتفاظ',       color: 'bg-pink-100 text-pink-800',   req: 'F9.8' },
  [ReportType.Custom]:       { en: 'Custom',           ar: 'مخصص',                 color: 'bg-slate-100 text-slate-800', req: '—' },
};

export function ReportsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { definitions, activeReportId } = useReportsModule();
  const [filterType, setFilterType] = useState<ReportType | 'ALL'>('ALL');

  const visible = definitions.filter((r) => filterType === 'ALL' || r.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Reports & Statistics</h1>
          <p className="text-sm text-muted-foreground">M9 · Pre-built analytical reports — filterable, exportable.</p>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">Filter by type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ReportType | 'ALL')}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="ALL">All reports</option>
          {Object.values(ReportType).filter((t) => t !== ReportType.Custom).map((t) => (
            <option key={t} value={t}>{TYPE_META[t].en}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{visible.length} report{visible.length !== 1 ? 's' : ''}</span>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((r) => {
          const meta = TYPE_META[r.type];
          const isActive = activeReportId === r.id;
          return (
            <div
              key={r.id}
              className={`rounded-xl border bg-background p-4 space-y-3 transition-shadow ${isActive ? 'ring-2 ring-primary' : 'hover:shadow-sm'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm">{r.nameEn}</p>
                  <p className="text-xs text-muted-foreground">{r.nameAr}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${meta.color}`}>
                  {meta.req}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${meta.color}`}>{meta.en}</span>
                {r.schedule && (
                  <span className="text-xs text-muted-foreground">⏱ Scheduled</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(setActiveReport(r.id))}
                  className="text-xs h-8 px-3 rounded-md border hover:bg-muted flex-1"
                >
                  {isActive ? 'Selected' : 'Select'}
                </button>
                <Link
                  href={`/${local}/reports/${r.id}`}
                  className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center justify-center flex-1"
                >
                  Open report
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
