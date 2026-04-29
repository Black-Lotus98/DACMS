import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  branchId: z.string().min(1),
  parentDeptId: z.string().optional(),
  responsibleEmail: z.string().email().optional(),
});

export const assignResponsibleSchema = z.object({
  departmentId: z.string().min(1),
  responsibleEmail: z.string().email(),
});
