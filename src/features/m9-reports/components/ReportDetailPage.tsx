'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useReportsModule } from '../hooks';
import { updateSchedule } from '../store/slice';
import { ReportType, ExportFormat, type ReportFilters, type ReportDefinition } from '../types';
import { LendingStatus } from '@/features/m6-lending/types';
import { DestructionStatus } from '@/features/m7-destruction/types';
import { RecordStatus } from '@/features/m3-records/types';

// ─── helpers ───────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);

function inRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to   && date > to)   return false;
  return true;
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function overdueDays(dateStr: string) {
  return Math.ceil((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

// ─── report bodies ─────────────────────────────────────────────────────────

function TransfersBody({ filters }: { filters: ReportFilters }) {
  const history = useAppSelector((s) => s.records.locationHistory);
  const filtered = history.filter((h) => {
    if (!inRange(h.movedAt, filters.dateFrom, filters.dateTo)) return false;
    if (filters.officerId && h.movedBy !== filters.officerId) return false;
    return true;
  });
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{filtered.length} transfer{filtered.length !== 1 ? 's' : ''} found · F9.1</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">Record ID</th>
            <th className="py-2 pr-4">From Box</th>
            <th className="py-2 pr-4">To Box</th>
            <th className="py-2 pr-4">Moved By</th>
            <th className="py-2 pr-4">Date</th>
            <th className="py-2">Reason</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-4 text-muted-foreground">No transfers in selected range.</td></tr>
            ) : filtered.map((h) => (
              <tr key={h.id} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-4 font-mono text-xs">{h.recordId}</td>
                <td className="py-2 pr-4">{h.fromBox}</td>
                <td className="py-2 pr-4">{h.toBox}</td>
                <td className="py-2 pr-4">{h.movedBy}</td>
                <td className="py-2 pr-4">{h.movedAt.slice(0, 10)}</td>
                <td className="py-2">{h.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LendingBody({ filters }: { filters: ReportFilters }) {
  const requests = useAppSelector((s) => s.lending.requests);
  const filtered = requests.filter((r) => {
    if (!inRange(r.requestedAt, filters.dateFrom, filters.dateTo)) return false;
    if (filters.departmentId && r.deptId !== filters.departmentId) return false;
    if (filters.status && r.status !== filters.status) return false;
    return true;
  });
  const stats = {
    total:    filtered.length,
    approved: filtered.filter((r) => r.status === LendingStatus.Approved || r.status === LendingStatus.Active || r.status === LendingStatus.Returned).length,
    rejected: filtered.filter((r) => r.status === LendingStatus.Rejected).length,
    returned: filtered.filter((r) => r.status === LendingStatus.Returned).length,
    overdue:  filtered.filter((r) => r.status === LendingStatus.Overdue).length,
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {([['Total', stats.total, ''], ['Approved', stats.approved, 'text-green-700'], ['Rejected', stats.rejected, 'text-red-700'], ['Returned', stats.returned, 'text-blue-700'], ['Overdue', stats.overdue, 'text-orange-700']] as [string, number, string][]).map(([label, val, cls]) => (
          <div key={label} className="rounded-lg border p-3 text-center">
            <p className={`text-2xl font-bold ${cls}`}>{val}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">F9.2 · Grouped by status</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">Ref #</th>
            <th className="py-2 pr-4">Department</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Requested</th>
            <th className="py-2">Due Date</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-muted-foreground">No lending requests in selected range.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                <td className="py-2 pr-4">{r.deptId}</td>
                <td className="py-2 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === LendingStatus.Overdue ? 'bg-orange-100 text-orange-800' : r.status === LendingStatus.Returned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-2 pr-4">{r.requestedAt.slice(0, 10)}</td>
                <td className="py-2">{r.dueDate?.slice(0, 10) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DestructionBody({ filters }: { filters: ReportFilters }) {
  const requests   = useAppSelector((s) => s.destruction.requests);
  const migrations = useAppSelector((s) => s.destruction.migrations);
  const filteredD  = requests.filter((r) => {
    if ((filters.dateFrom || filters.dateTo) && !inRange(r.executedAt ?? '', filters.dateFrom, filters.dateTo)) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.officerId && r.approvedBy !== filters.officerId && r.executedBy !== filters.officerId) return false;
    return true;
  });
  const filteredM  = migrations.filter((m) => !filters.status || m.status === filters.status);
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium text-sm mb-2">Destruction Requests · F9.3</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left text-muted-foreground text-xs">
              <th className="py-2 pr-4">Ref #</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Executed By</th>
              <th className="py-2 pr-4">Executed At</th>
              <th className="py-2">Certificate</th>
            </tr></thead>
            <tbody>
              {filteredD.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-muted-foreground">No destruction requests.</td></tr>
              ) : filteredD.map((r) => (
                <tr key={r.id} className="border-b hover:bg-muted/40">
                  <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === DestructionStatus.Executed ? 'bg-green-100 text-green-800' : r.status === DestructionStatus.Rejected ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{r.executedBy ?? '—'}</td>
                  <td className="py-2 pr-4">{r.executedAt?.slice(0, 10) ?? '—'}</td>
                  <td className="py-2">{r.certificate ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="font-medium text-sm mb-2">Migration Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left text-muted-foreground text-xs">
              <th className="py-2 pr-4">Ref #</th>
              <th className="py-2 pr-4">Destination</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2">Status</th>
            </tr></thead>
            <tbody>
              {filteredM.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-muted-foreground">No migration requests.</td></tr>
              ) : filteredM.map((r) => (
                <tr key={r.id} className="border-b hover:bg-muted/40">
                  <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                  <td className="py-2 pr-4">{r.destination}</td>
                  <td className="py-2 pr-4">{r.type}</td>
                  <td className="py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryBody({ filters }: { filters: ReportFilters }) {
  const records = useAppSelector((s) => s.records.items);
  const filtered = records.filter((r) => {
    if (!inRange(r.archiveDate, filters.dateFrom, filters.dateTo)) return false;
    if (filters.docTypeId && r.docTypeId !== filters.docTypeId) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.roomId && !r.boxId.startsWith(filters.roomId)) return false;
    return true;
  });
  const byStatus = Object.values(RecordStatus).map((s) => ({ status: s, count: filtered.filter((r) => r.status === s).length }));
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{filtered.length} records · F9.4</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {byStatus.map(({ status, count }) => (
          <div key={status} className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">{status}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">Ref #</th>
            <th className="py-2 pr-4">Title (EN)</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Secrecy</th>
            <th className="py-2 pr-4">Box</th>
            <th className="py-2">Archive Date</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-4 text-muted-foreground">No records in selected range.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                <td className="py-2 pr-4">{r.titleEn}</td>
                <td className="py-2 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === RecordStatus.Active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-2 pr-4">{r.secrecy}</td>
                <td className="py-2 pr-4">{r.boxId}</td>
                <td className="py-2">{r.archiveDate.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CapacityBody() {
  const rooms   = useAppSelector((s) => s.archiveStructure.rooms);
  const shelves = useAppSelector((s) => s.archiveStructure.shelves);

  function colorClass(pct: number) {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-400';
    return 'bg-green-500';
  }
  function textClass(pct: number) {
    if (pct >= 90) return 'text-red-700';
    if (pct >= 70) return 'text-amber-700';
    return 'text-green-700';
  }

  const roomFilter = useAppSelector((s) => s.reports.definitions.find((r) => r.id === s.reports.activeReportId)?.filters.roomId);
  const filteredRooms = roomFilter ? rooms.filter((room) => room.id === roomFilter || room.code === roomFilter) : rooms;

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">F9.5 · Color-coded: green &lt;70%, amber 70–89%, red ≥90%</p>
      <div>
        <h3 className="font-medium text-sm mb-3">Rooms</h3>
        <div className="space-y-3">
          {filteredRooms.map((room) => {
            const pct = room.capacity > 0 ? Math.round((room.currentUse / room.capacity) * 100) : 0;
            return (
              <div key={room.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{room.nameEn}</span>
                    <span className="text-xs text-muted-foreground ml-2">{room.code}</span>
                  </div>
                  <span className={`font-bold text-sm ${textClass(pct)}`}>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${colorClass(pct)}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{room.currentUse} / {room.capacity} units</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-sm mb-3">Shelves</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-left text-muted-foreground text-xs">
              <th className="py-2 pr-4">Code</th>
              <th className="py-2 pr-4">Used</th>
              <th className="py-2 pr-4">Capacity</th>
              <th className="py-2">Fill %</th>
            </tr></thead>
            <tbody>
              {shelves.map((s) => {
                const pct = s.capacity > 0 ? Math.round((s.used / s.capacity) * 100) : 0;
                return (
                  <tr key={s.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-4">{s.code}</td>
                    <td className="py-2 pr-4">{s.used}</td>
                    <td className="py-2 pr-4">{s.capacity}</td>
                    <td className={`py-2 font-medium ${textClass(pct)}`}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserActivityBody() {
  const accessLogs = useAppSelector((s) => s.permissions.accessLogs);
  const byUser = accessLogs.reduce<Record<string, number>>((acc, item) => {
    acc[item.userId] = (acc[item.userId] ?? 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(byUser).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">User Activity Report · F9.6 (admin-focused)</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">User ID</th>
            <th className="py-2">Action Count</th>
          </tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={2} className="py-4 text-muted-foreground">No activity logs available.</td></tr>
            ) : rows.map(([userId, count]) => (
              <tr key={userId} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-4 font-mono text-xs">{userId}</td>
                <td className="py-2">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OverdueBody({ filters }: { filters: ReportFilters }) {
  const requests = useAppSelector((s) => s.lending.requests);
  const overdue  = requests.filter((r) =>
    r.status === LendingStatus.Overdue ||
    (r.dueDate && r.dueDate < TODAY && r.status === LendingStatus.Active)
  ).filter((r) => inRange(r.dueDate ?? '', filters.dateFrom, filters.dateTo));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{overdue.length} overdue request{overdue.length !== 1 ? 's' : ''} · F9.7 · Real-time</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">Ref #</th>
            <th className="py-2 pr-4">Requester</th>
            <th className="py-2 pr-4">Department</th>
            <th className="py-2 pr-4">Due Date</th>
            <th className="py-2">Days Overdue</th>
          </tr></thead>
          <tbody>
            {overdue.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-green-700 font-medium">No overdue requests — all clear.</td></tr>
            ) : overdue.map((r) => (
              <tr key={r.id} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                <td className="py-2 pr-4">{r.requesterId}</td>
                <td className="py-2 pr-4">{r.deptId}</td>
                <td className="py-2 pr-4 text-red-600">{r.dueDate?.slice(0, 10) ?? '—'}</td>
                <td className="py-2 font-bold text-red-600">{r.dueDate ? overdueDays(r.dueDate) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExpiryBody({ filters }: { filters: ReportFilters }) {
  const records = useAppSelector((s) => s.records.items);
  const expiring = records.filter((r) => {
    const days = daysUntil(r.retentionEnd);
    return days >= 0 && days <= 90;
  }).filter((r) => inRange(r.retentionEnd, filters.dateFrom, filters.dateTo));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{expiring.length} record{expiring.length !== 1 ? 's' : ''} expiring within 90 days · F9.8</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b text-left text-muted-foreground text-xs">
            <th className="py-2 pr-4">Ref #</th>
            <th className="py-2 pr-4">Title (EN)</th>
            <th className="py-2 pr-4">Retention End</th>
            <th className="py-2 pr-4">Days Left</th>
            <th className="py-2">Box</th>
          </tr></thead>
          <tbody>
            {expiring.length === 0 ? (
              <tr><td colSpan={5} className="py-4 text-green-700 font-medium">No records expiring within 90 days.</td></tr>
            ) : expiring.map((r) => {
              const days = daysUntil(r.retentionEnd);
              return (
                <tr key={r.id} className="border-b hover:bg-muted/40">
                  <td className="py-2 pr-4 font-mono text-xs">{r.refNo}</td>
                  <td className="py-2 pr-4">{r.titleEn}</td>
                  <td className="py-2 pr-4">{r.retentionEnd.slice(0, 10)}</td>
                  <td className={`py-2 pr-4 font-bold ${days <= 7 ? 'text-red-600' : days <= 30 ? 'text-orange-600' : 'text-yellow-700'}`}>
                    {days}d
                  </td>
                  <td className="py-2">{r.boxId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportBody({ report, filters }: { report: ReportDefinition; filters: ReportFilters }) {
  switch (report.type) {
    case ReportType.Transfers:    return <TransfersBody filters={filters} />;
    case ReportType.Lending:      return <LendingBody filters={filters} />;
    case ReportType.Destruction:  return <DestructionBody filters={filters} />;
    case ReportType.Inventory:    return <InventoryBody filters={filters} />;
    case ReportType.Capacity:     return <CapacityBody />;
    case ReportType.UserActivity: return <UserActivityBody />;
    case ReportType.Overdue:      return <OverdueBody filters={filters} />;
    case ReportType.Expiry:       return <ExpiryBody filters={filters} />;
    default:                      return <p className="text-sm text-muted-foreground">Custom report — define filters to generate.</p>;
  }
}

// ─── main exported component ───────────────────────────────────────────────

export function ReportDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getReportById } = useReportsModule();
  const report = getReportById(id);

  const [filters, setFilters] = useState<ReportFilters>({});
  const [cronValue, setCronValue]       = useState(report?.schedule?.cron ?? '');
  const [recipientsValue, setRecipientsValue] = useState(report?.schedule?.recipients?.join(', ') ?? '');
  const [exportFeedback, setExportFeedback]   = useState<string | null>(null);
  const [scheduleSaved, setScheduleSaved]     = useState(false);

  if (!report) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <Link href={`/${local}/reports`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to reports
        </Link>
      </div>
    );
  }

  function handleExport(fmt: ExportFormat) {
    const fileBase = `${report!.id}-${new Date().toISOString().slice(0, 10)}`;
    const content = [
      `Report: ${report!.nameEn}`,
      `Type: ${report!.type}`,
      `GeneratedAt: ${new Date().toISOString()}`,
      `Filters: ${JSON.stringify(filters)}`,
    ].join('\n');
    const ext = fmt === ExportFormat.PDF ? 'txt' : 'csv';
    const mime = fmt === ExportFormat.PDF ? 'text/plain' : 'text/csv';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileBase}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    setExportFeedback(`Exported "${report!.nameEn}" as ${fmt} (${ext.toUpperCase()} file).`);
    setTimeout(() => setExportFeedback(null), 2500);
  }

  function handleSaveSchedule() {
    if (!cronValue.trim()) return;
    dispatch(updateSchedule({
      id: report!.id,
      schedule: {
        cron:       cronValue.trim(),
        recipients: recipientsValue.split(',').map((e) => e.trim()).filter(Boolean),
      },
    }));
    setScheduleSaved(true);
    setTimeout(() => setScheduleSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{report.nameEn}</h1>
          <p className="text-sm text-muted-foreground">{report.nameAr} · {report.type}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/${local}/reports`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
            All reports
          </Link>
          {/* Export — F9.10 */}
          {Object.values(ExportFormat).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
            >
              Export {fmt}
            </button>
          ))}
        </div>
      </div>

      {exportFeedback && (
        <div className="rounded-md border border-green-300 bg-green-50 text-green-800 text-sm px-4 py-2">
          {exportFeedback}
        </div>
      )}

      {/* Filters — F9.1–F9.8 */}
      {report.type !== ReportType.Capacity && report.type !== ReportType.UserActivity && (
        <section className="rounded-xl border bg-background p-4 space-y-3">
          <h2 className="font-semibold text-sm">Filters</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">From date</label>
              <input
                type="date"
                value={filters.dateFrom ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">To date</label>
              <input
                type="date"
                value={filters.dateTo ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Department ID</label>
              <input
                value={filters.departmentId ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                placeholder="e.g. dept-1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Doc Type ID</label>
              <input
                value={filters.docTypeId ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, docTypeId: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                placeholder="e.g. dt1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Status</label>
              <input
                value={filters.status ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                placeholder="e.g. OVERDUE"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Room ID / Code</label>
              <input
                value={filters.roomId ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, roomId: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                placeholder="e.g. R01"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Officer ID</label>
              <input
                value={filters.officerId ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, officerId: e.target.value || undefined }))}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                placeholder="e.g. user1"
              />
            </div>
          </div>
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={() => setFilters({})}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      {/* Report body */}
      <section className="rounded-xl border bg-background p-4">
        <ReportBody report={report} filters={filters} />
      </section>

      {/* Schedule — F9.9 */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <h2 className="font-semibold text-sm">Auto-Schedule · F9.9</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Cron expression</label>
            <input
              type="text"
              placeholder="0 6 * * 1  (every Monday at 06:00)"
              value={cronValue}
              onChange={(e) => setCronValue(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-3 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Email recipients (comma-separated)</label>
            <input
              type="text"
              placeholder="supervisor@org.com, director@org.com"
              value={recipientsValue}
              onChange={(e) => setRecipientsValue(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSchedule}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
          >
            Save schedule
          </button>
          {scheduleSaved && <span className="text-xs text-green-600">Schedule saved.</span>}
          {report.schedule && (
            <span className="text-xs text-muted-foreground">
              Current: <span className="font-mono">{report.schedule.cron}</span> → {report.schedule.recipients.join(', ') || 'no recipients'}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
