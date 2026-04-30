import { RoleType, ClearanceLevel } from '@/config/roles';

export { RoleType, ClearanceLevel };

export enum RoleAssignmentType {
  MultiUser  = 'MULTI_USER',
  OnePerDept = 'ONE_PER_DEPT',
  OnePerOrg  = 'ONE_PER_ORG',
}

export interface Permission {
  id: string;
  permKey: string;
  module: string;
  labelAr: string;
  labelEn: string;
}

export interface PermissionGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  permissionKeys: string[];
}

export interface RoleEntity {
  id: string;
  type: RoleType;
  nameAr: string;
  nameEn: string;
  assignmentType: RoleAssignmentType;
  description?: string;
  permissionKeys: string[];
}

export interface UserEntity {
  id: string;
  username: string;
  nameAr: string;
  nameEn: string;
  email: string;
  deptId?: string;
  branchId?: string;
  roleIds: string[];
  clearanceLevel: ClearanceLevel;
  isActive: boolean;
  lastLogin?: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  timestamp: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  expiryDays: number;
  maxFailedAttempts: number;
}

export interface PermissionsState {
  users: UserEntity[];
  roles: RoleEntity[];
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
  accessLogs: AccessLog[];
  passwordPolicy: PasswordPolicy;
}
