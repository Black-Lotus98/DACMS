import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useOrgModule() {
  const { organization, branches, departments } = useAppSelector((s) => s.org);

  return useMemo(() => ({
    organization,
    branches,
    departments,
    getBranchById: (id: string) => branches.find((b) => b.id === id) ?? null,
    getBranchDepts: (branchId: string) => departments.filter((d) => d.branchId === branchId),
    getRootDepts: (branchId: string) =>
      departments.filter((d) => d.branchId === branchId && !d.parentDeptId),
    getChildDepts: (parentId: string) =>
      departments.filter((d) => d.parentDeptId === parentId),
  }), [organization, branches, departments]);
}
