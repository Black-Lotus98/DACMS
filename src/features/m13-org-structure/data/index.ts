import type { Branch, Department, Organization } from '../types';

export const orgSeed: Organization = {
  id: 'org1',
  name: 'Ministry of Industry and Trade',
  code: 'MIT',
};

export const branchesSeed: Branch[] = [
  { id: 'b1', name: 'Riyadh Branch', code: 'RYD', organizationId: 'org1' },
  { id: 'b2', name: 'Jeddah Branch', code: 'JED', organizationId: 'org1' },
  { id: 'b3', name: 'Dammam Branch', code: 'DMM', organizationId: 'org1' },
];

export const departmentsSeed: Department[] = [
  { id: 'd1', name: 'Central Archive Department', code: 'RYD-ARC', branchId: 'b1' },
  { id: 'd2', name: 'Documents Section', code: 'RYD-DOC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd3', name: 'Records Section', code: 'RYD-REC', branchId: 'b1', parentDeptId: 'd1' },
  { id: 'd4', name: 'Licensing Department', code: 'RYD-LIC', branchId: 'b1' },
  { id: 'd5', name: 'Sub Archive Department', code: 'JED-ARC', branchId: 'b2' },
  { id: 'd6', name: 'Documents Section', code: 'JED-DOC', branchId: 'b2', parentDeptId: 'd5' },
  { id: 'd7', name: 'Administrative Affairs', code: 'JED-ADM', branchId: 'b2' },
  { id: 'd8', name: 'Archive Department', code: 'DMM-ARC', branchId: 'b3' },
  { id: 'd9', name: 'Preservation Section', code: 'DMM-REC', branchId: 'b3', parentDeptId: 'd8' },
  { id: 'd10', name: 'HR Department', code: 'DMM-HR', branchId: 'b3' },
];
