import type { KPIDefinition, KPISnapshot } from '../types';
import { KpiGroup, KpiUnit } from '../types';

export const kpiDefinitionsSeed: KPIDefinition[] = [
  // ── Operational (F12.1) ─────────────────────────────────────────────────
  {
    id: 'kpi-op-1', key: 'archive_occupancy',
    nameAr: 'معدل إشغال الأرشيف', nameEn: 'Archive Occupancy Rate',
    formula: 'sum(rooms.currentUse) / sum(rooms.capacity) × 100',
    targetValue: 85, unit: KpiUnit.Percent, group: KpiGroup.Operational,
    roleScope: ['center_director', 'archive_supervisor'], higherIsBetter: false,
  },
  {
    id: 'kpi-op-2', key: 'records_digitized_rate',
    nameAr: 'معدل رقمنة الوثائق', nameEn: 'Records Digitization Rate',
    formula: 'records with ≥1 file / total records × 100',
    targetValue: 50, unit: KpiUnit.Percent, group: KpiGroup.Operational,
    roleScope: ['center_director', 'archive_supervisor'], higherIsBetter: true,
  },
  {
    id: 'kpi-op-3', key: 'avg_processing_time',
    nameAr: 'متوسط وقت معالجة الوثائق', nameEn: 'Avg Record Processing Time',
    formula: 'avg(|archiveDate − issueDate|) in days',
    targetValue: 3, unit: KpiUnit.Days, group: KpiGroup.Operational,
    roleScope: ['center_director', 'archive_supervisor', 'admin'], higherIsBetter: false,
  },

  // ── Lending (F12.2) ──────────────────────────────────────────────────────
  {
    id: 'kpi-ln-1', key: 'avg_lending_duration',
    nameAr: 'متوسط مدة الإعارة', nameEn: 'Avg Lending Duration',
    formula: 'avg(returnedAt − approvedAt) in days for returned requests',
    targetValue: 7, unit: KpiUnit.Days, group: KpiGroup.Lending,
    roleScope: ['center_director', 'archive_supervisor'], higherIsBetter: false,
  },
  {
    id: 'kpi-ln-2', key: 'overdue_rate',
    nameAr: 'معدل الإعارات المتأخرة', nameEn: 'Overdue Lending Rate',
    formula: 'overdue requests / active requests × 100',
    targetValue: 10, unit: KpiUnit.Percent, group: KpiGroup.Lending,
    roleScope: ['center_director', 'archive_supervisor', 'admin'], higherIsBetter: false,
  },
  {
    id: 'kpi-ln-3', key: 'lending_request_count',
    nameAr: 'إجمالي طلبات الإعارة', nameEn: 'Total Lending Requests',
    formula: 'count(lending.requests)',
    targetValue: undefined, unit: KpiUnit.Count, group: KpiGroup.Lending,
    roleScope: ['center_director', 'archive_supervisor'], higherIsBetter: true,
  },

  // ── Storage (F12.3) ──────────────────────────────────────────────────────
  {
    id: 'kpi-st-1', key: 'storage_capacity_used',
    nameAr: 'سعة التخزين المستخدمة', nameEn: 'Storage Capacity Used',
    formula: 'sum(shelves.used) / sum(shelves.capacity) × 100',
    targetValue: 80, unit: KpiUnit.Percent, group: KpiGroup.Storage,
    roleScope: ['center_director', 'archive_supervisor'], higherIsBetter: false,
  },
  {
    id: 'kpi-st-2', key: 'inactive_records_rate',
    nameAr: 'معدل الوثائق المؤرشفة', nameEn: 'Archived Records Rate',
    formula: 'records with status ARCHIVED / total × 100',
    targetValue: 30, unit: KpiUnit.Percent, group: KpiGroup.Storage,
    roleScope: ['archive_supervisor'], higherIsBetter: false,
  },

  // ── Destruction (F12.4) ──────────────────────────────────────────────────
  {
    id: 'kpi-ds-1', key: 'destruction_pending_count',
    nameAr: 'طلبات الإتلاف المعلقة', nameEn: 'Pending Destruction Requests',
    formula: 'count(destruction.requests where status = PENDING)',
    targetValue: 5, unit: KpiUnit.Count, group: KpiGroup.Destruction,
    roleScope: ['center_director', 'archive_supervisor', 'admin'], higherIsBetter: false,
  },
  {
    id: 'kpi-ds-2', key: 'destruction_approved_rate',
    nameAr: 'معدل الموافقة على الإتلاف', nameEn: 'Destruction Approval Rate',
    formula: 'approved / (approved + rejected) × 100',
    targetValue: 75, unit: KpiUnit.Percent, group: KpiGroup.Destruction,
    roleScope: ['center_director'], higherIsBetter: true,
  },

  // ── Governance (F12.5) ───────────────────────────────────────────────────
  {
    id: 'kpi-gv-1', key: 'overdue_count',
    nameAr: 'عدد الإعارات المتأخرة', nameEn: 'Overdue Lending Count',
    formula: 'count(lending requests past dueDate and not returned)',
    targetValue: 10, unit: KpiUnit.Count, group: KpiGroup.Governance,
    roleScope: ['center_director', 'admin'], higherIsBetter: false,
  },
  {
    id: 'kpi-gv-2', key: 'user_activity_rate',
    nameAr: 'معدل نشاط المستخدمين', nameEn: 'Active Users Rate',
    formula: 'active users (logged in last 30 days) / total users × 100',
    targetValue: 70, unit: KpiUnit.Percent, group: KpiGroup.Governance,
    roleScope: ['center_director', 'admin'], higherIsBetter: true,
  },
  {
    id: 'kpi-gv-3', key: 'policy_compliance_rate',
    nameAr: 'معدل الامتثال للسياسات', nameEn: 'Policy Compliance Rate',
    formula: 'compliant actions / total audited actions × 100',
    targetValue: 90, unit: KpiUnit.Percent, group: KpiGroup.Governance,
    roleScope: ['center_director', 'admin'], higherIsBetter: true,
  },
];

// 12 months of snapshot history (2025-05 → 2026-04) for each KPI
const PERIODS = [
  '2025-05','2025-06','2025-07','2025-08','2025-09','2025-10',
  '2025-11','2025-12','2026-01','2026-02','2026-03','2026-04',
];

const snapshotValues: Record<string, number[]> = {
  'kpi-op-1': [68, 70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
  'kpi-op-2': [28, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 42],
  'kpi-op-3': [6,  5,  5,  5,  4,  4,  4,  4,  3,  3,  4,  3 ],
  'kpi-ln-1': [8,  8,  7,  7,  6,  7,  7,  6,  6,  5,  6,  6 ],
  'kpi-ln-2': [18, 16, 15, 14, 13, 14, 12, 11, 10, 11, 10, 9  ],
  'kpi-ln-3': [82, 88, 91, 95, 98, 102,107,110,113,115,118,121],
  'kpi-st-1': [58, 60, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72],
  'kpi-st-2': [22, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28],
  'kpi-ds-1': [9,  8,  10, 7,  8,  6,  9,  7,  8,  6,  7,  5 ],
  'kpi-ds-2': [71, 73, 74, 76, 75, 77, 78, 79, 80, 81, 82, 83],
  'kpi-gv-1': [14, 13, 12, 11, 13, 12, 10, 11, 10, 9,  10, 9 ],
  'kpi-gv-2': [63, 65, 66, 67, 68, 68, 69, 70, 71, 72, 73, 74],
  'kpi-gv-3': [80, 81, 82, 83, 84, 85, 85, 86, 87, 88, 89, 90],
};

let snapIdx = 0;
export const kpiSnapshotsSeed: KPISnapshot[] = kpiDefinitionsSeed.flatMap((def) =>
  PERIODS.map((period, i) => ({
    id:         `snap-${++snapIdx}`,
    kpiId:      def.id,
    value:      snapshotValues[def.id]?.[i] ?? 0,
    period,
    computedAt: `${period}-01T00:00:00.000Z`,
  }))
);
