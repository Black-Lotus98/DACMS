import type { Branch, Department, Organization } from '../types';

export const orgSeed: Organization = {
  id: 'org1',
  name: 'وزارة الصناعة والتجارة',
  code: 'MIT',
};

export const branchesSeed: Branch[] = [
  { id: 'b1', name: 'فرع الرياض', code: 'RYD', organizationId: 'org1' },
  { id: 'b2', name: 'فرع جدة', code: 'JED', organizationId: 'org1' },
  { id: 'b3', name: 'فرع الدمام', code: 'DMM', organizationId: 'org1' },
];

export const departmentsSeed: Department[] = [
  { id: 'd1', name: 'إدارة الأرشيف المركزي', code: 'RYD-ARC', branchId: 'b1' },
  { id: 'd2', name: 'قسم الوثائق', code: 'RYD-DOC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd3', name: 'قسم السجلات', code: 'RYD-REC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd4', name: 'إدارة التراخيص', code: 'RYD-LIC', branchId: 'b1' },
  { id: 'd5', name: 'إدارة الأرشيف الفرعي', code: 'JED-ARC', branchId: 'b2' },
  { id: 'd6', name: 'قسم الوثائق', code: 'JED-DOC', branchId: 'b2', parentDeptId: 'd5' },
  { id: 'd7', name: 'إدارة الشؤون الإدارية', code: 'JED-ADM', branchId: 'b2' },
  { id: 'd8', name: 'إدارة الأرشيف', code: 'DMM-ARC', branchId: 'b3' },
  { id: 'd9', name: 'قسم المحفوظات', code: 'DMM-REC', branchId: 'b3', parentDeptId: 'd8' },
  { id: 'd10', name: 'إدارة الموارد البشرية', code: 'DMM-HR', branchId: 'b3' },
];
