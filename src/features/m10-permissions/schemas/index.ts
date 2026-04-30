import { z } from 'zod';
import { RoleAssignmentType, ClearanceLevel } from '../types';

export const createUserSchema = z.object({
  username:       z.string().min(3).max(50),
  nameAr:         z.string().min(2),
  nameEn:         z.string().min(2),
  email:          z.string().email(),
  deptId:         z.string().optional(),
  branchId:       z.string().optional(),
  roleIds:        z.array(z.string()).min(1, 'At least one role required'),
  clearanceLevel: z.nativeEnum(ClearanceLevel),
});

export const editUserSchema = createUserSchema.partial().extend({
  id: z.string(),
});

export const assignRolesSchema = z.object({
  userId:  z.string(),
  roleIds: z.array(z.string()).min(1),
});

export const createRoleSchema = z.object({
  nameAr:         z.string().min(2),
  nameEn:         z.string().min(2),
  assignmentType: z.nativeEnum(RoleAssignmentType),
  description:    z.string().optional(),
  permissionKeys: z.array(z.string()),
});

export const permissionGroupSchema = z.object({
  nameAr:         z.string().min(2),
  nameEn:         z.string().min(2),
  permissionKeys: z.array(z.string()).min(1),
});

export const passwordPolicySchema = z.object({
  minLength:          z.number().min(6).max(32),
  requireUppercase:   z.boolean(),
  requireNumbers:     z.boolean(),
  requireSymbols:     z.boolean(),
  expiryDays:         z.number().min(0).max(365),
  maxFailedAttempts:  z.number().min(1).max(20),
});
