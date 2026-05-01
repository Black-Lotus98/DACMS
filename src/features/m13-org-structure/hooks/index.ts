import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useOrgModule() {
  const { organization, branches, departments, levelDefinitions } = useAppSelector((s) => s.org);

  return useMemo(() => ({
    organization,
    branches,
    departments,
    levelDefinitions,

    activeBranches:   branches.filter((b) => b.isActive),
    inactiveBranches: branches.filter((b) => !b.isActive),

    getBranchById:  (id: string) => branches.find((b) => b.id === id) ?? null,
    getDeptById:    (id: string) => departments.find((d) => d.id === id) ?? null,
    getDeptByCode:  (code: string) => departments.find((d) => d.code === code) ?? null,
    getBranchDepts: (branchId: string) => departments.filter((d) => d.branchId === branchId),
    getRootDepts:   (branchId: string) => departments.filter((d) => d.branchId === branchId && !d.parentDeptId),
    getChildDepts:  (parentId: string) => departments.filter((d) => d.parentDeptId === parentId),
  }), [organization, branches, departments, levelDefinitions]);
}
