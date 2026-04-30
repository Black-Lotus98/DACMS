import type { Branch, Department, Organization } from '../types';

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
