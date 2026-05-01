import { RoleType, ClearanceLevel } from '@/config/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  clearanceLevel: ClearanceLevel;
  departmentId?: string;
  userDepartments: string[];   // dept IDs this user belongs to (for workflow task matching)
}

export interface AuthSession {
  user: User | null;
  role: RoleType | null;
  clearanceLevel: ClearanceLevel | null;
  isAuthenticated: boolean;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: string;
  roles: RoleType[];
  children?: NavItem[];
}

export interface ApiError {
  message: string;
  status: number;
}
