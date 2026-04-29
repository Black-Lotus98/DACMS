import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useOrgModule() {
  const { organization, branches, departments } = useAppSelector((s) => s.org);

  return useMemo(() => ({
    organization,
    branches,
    departments,
    getRootDepts: (branchId: string) =>
      departments.filter((d) => d.branchId === branchId && !d.parentDeptId),
    getChildDepts: (parentId: string) =>
      departments.filter((d) => d.parentDeptId === parentId),
  }), [organization, branches, departments]);
}
