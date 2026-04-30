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
  organization: Organization;
  branches: Branch[];
  departments: Department[];
}
