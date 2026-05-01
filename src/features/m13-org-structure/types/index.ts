export enum OrgLevel {
  Supervisory    = 'SUPERVISORY',
  Operational    = 'OPERATIONAL',
  Technical      = 'TECHNICAL',
  Organizational = 'ORGANIZATIONAL',
}

export interface OrgLevelDefinition {
  level:       OrgLevel;
  labelAr:     string;
  labelEn:     string;
  roles:       string[];
  accessSummaryAr: string;
  accessSummaryEn: string;
}

export interface Organization {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  organizationId: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  branchId: string;
  parentDeptId?: string;
  assigneeId?: string;
  responsibleEmail?: string;
}

export interface OrgState {
  organization:    Organization;
  branches:        Branch[];
  departments:     Department[];
  levelDefinitions: OrgLevelDefinition[];
}
