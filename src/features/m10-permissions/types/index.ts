import { ClearanceLevel, RoleType } from '@/config/roles';

export interface Permission {
  id: string;
  key: string;
  label: string;
  module: string;
}

export interface RoleEntity {
  id: string;
  name: string;
  type: RoleType;
  clearanceLevel: ClearanceLevel;
  permissions: string[];
}

export interface UserEntity {
  id: string;
  fullName: string;
  email: string;
  role: RoleType;
  clearanceLevel: ClearanceLevel;
  isActive: boolean;
}

export interface AccessLog {
  id: string;
  userEmail: string;
  action: string;
  createdAt: string;
}

export interface PermissionsState {
  users: UserEntity[];
  roles: RoleEntity[];
  permissions: Permission[];
  accessLogs: AccessLog[];
}
