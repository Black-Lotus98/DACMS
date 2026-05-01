import type { Branch, Department, Organization, OrgLevelDefinition } from '../types';
import { OrgLevel } from '../types';

export const orgSeed: Organization = {
  id: 'org1',
  nameAr: 'وزارة الصناعة والتجارة',
  nameEn: 'Ministry of Industry and Trade',
  code: 'MIT',
};

export const branchesSeed: Branch[] = [
  { id: 'b1', nameAr: 'فرع الرياض', nameEn: 'Riyadh Branch', code: 'RYD', organizationId: 'org1', isActive: true },
  { id: 'b2', nameAr: 'فرع جدة', nameEn: 'Jeddah Branch', code: 'JED', organizationId: 'org1', isActive: true },
  { id: 'b3', nameAr: 'فرع الدمام', nameEn: 'Dammam Branch', code: 'DMM', organizationId: 'org1', isActive: true },
];

export const departmentsSeed: Department[] = [
  { id: 'd1', nameAr: 'إدارة الأرشيف المركزية', nameEn: 'Central Archive Department', code: 'RYD-ARC', branchId: 'b1', assigneeId: 'u2', responsibleEmail: 'supervisor@dacms.gov' },
  { id: 'd2', nameAr: 'قسم الوثائق', nameEn: 'Documents Section', code: 'RYD-DOC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd3', nameAr: 'قسم السجلات', nameEn: 'Records Section', code: 'RYD-REC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd4', nameAr: 'إدارة التراخيص', nameEn: 'Licensing Department', code: 'RYD-LIC', branchId: 'b1' },
  { id: 'd5', nameAr: 'إدارة الأرشيف الفرعية', nameEn: 'Sub Archive Department', code: 'JED-ARC', branchId: 'b2' },
  { id: 'd6', nameAr: 'قسم الوثائق', nameEn: 'Documents Section', code: 'JED-DOC', branchId: 'b2', parentDeptId: 'd5' },
  { id: 'd7', nameAr: 'الشؤون الإدارية', nameEn: 'Administrative Affairs', code: 'JED-ADM', branchId: 'b2' },
  { id: 'd8', nameAr: 'إدارة الأرشيف', nameEn: 'Archive Department', code: 'DMM-ARC', branchId: 'b3' },
  { id: 'd9', nameAr: 'قسم الحفظ', nameEn: 'Preservation Section', code: 'DMM-REC', branchId: 'b3', parentDeptId: 'd8' },
  { id: 'd10', nameAr: 'إدارة الموارد البشرية', nameEn: 'HR Department', code: 'DMM-HR', branchId: 'b3' },
];

export const levelDefinitionsSeed: OrgLevelDefinition[] = [
  {
    level: OrgLevel.Supervisory,
    labelAr: 'المستوى الإشرافي',
    labelEn: 'Supervisory Level',
    roles: ['center_director'],
    accessSummaryAr: 'مدير المركز — صلاحية كاملة على مؤشرات الأداء والتقارير وجميع السجلات',
    accessSummaryEn: 'Center Director — full visibility of KPIs, reports, and all records.',
  },
  {
    level: OrgLevel.Operational,
    labelAr: 'المستوى التشغيلي',
    labelEn: 'Operational Level',
    roles: ['archive_supervisor', 'archive_officer'],
    accessSummaryAr: 'مشرف الأرشيف وموظف الأرشيف — وصول مبني على المهام ومحدود بنطاق الفرع/القسم',
    accessSummaryEn: 'Archive Supervisor & Officer — task-based access scoped to branch/department.',
  },
  {
    level: OrgLevel.Technical,
    labelAr: 'المستوى التقني',
    labelEn: 'Technical Level',
    roles: ['admin'],
    accessSummaryAr: 'مدير النظام — صلاحية التهيئة الكاملة؛ بدون وصول تشغيلي افتراضياً (فصل الصلاحيات)',
    accessSummaryEn: 'System Admin — full configuration access; no operational data access by default.',
  },
  {
    level: OrgLevel.Organizational,
    labelAr: 'المستوى التنظيمي (المستفيدون)',
    labelEn: 'Organizational Level (Beneficiary)',
    roles: ['beneficiary'],
    accessSummaryAr: 'أقسام المستفيدين — قراءة واستعارة السجلات المرتبطة بقسمهم فقط',
    accessSummaryEn: 'Beneficiary departments — read and lending access to their own records only.',
  },
];
