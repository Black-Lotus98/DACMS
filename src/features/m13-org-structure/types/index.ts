export interface Organization {
  id: string;
  name: string;
  code: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  organizationId: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  branchId: string;
  parentDeptId?: string;
  responsibleEmail?: string;
}

export interface OrgState {
  organization: Organization;
  branches: Branch[];
  departments: Department[];
}
