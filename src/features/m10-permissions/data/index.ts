import { ClearanceLevel, RoleType, ROLE_CLEARANCE, ROLE_LABELS } from '@/config/roles';
import type { AccessLog, Permission, RoleEntity, UserEntity } from '../types';

export const permissionsSeed: Permission[] = [
  { id: 'p1', key: 'records.read', label: 'عرض السجلات', module: 'records' },
  { id: 'p2', key: 'records.write', label: 'تعديل السجلات', module: 'records' },
  { id: 'p3', key: 'archive.manage', label: 'إدارة هيكل الأرشيف', module: 'archive' },
  { id: 'p4', key: 'users.manage', label: 'إدارة المستخدمين', module: 'permissions' },
];

export const rolesSeed: RoleEntity[] = Object.values(RoleType).map((type, idx) => ({
  id: `r${idx + 1}`,
  name: ROLE_LABELS[type],
  type,
  clearanceLevel: ROLE_CLEARANCE[type],
  permissions: type === RoleType.Admin || type === RoleType.CenterDirector
    ? permissionsSeed.map((p) => p.key)
    : permissionsSeed.filter((p) => p.key !== 'users.manage').map((p) => p.key),
}));

export const usersSeed: UserEntity[] = [
  {
    id: 'u1',
    fullName: 'مدير النظام',
    email: 'admin@dacms.gov',
    role: RoleType.Admin,
    clearanceLevel: ClearanceLevel.TopSecret,
    isActive: true,
  },
  {
    id: 'u2',
    fullName: 'مشرف الأرشيف',
    email: 'supervisor@dacms.gov',
    role: RoleType.ArchiveSupervisor,
    clearanceLevel: ClearanceLevel.Confidential,
    isActive: true,
  },
  {
    id: 'u3',
    fullName: 'موظف الأرشيف',
    email: 'officer@dacms.gov',
    role: RoleType.ArchiveOfficer,
    clearanceLevel: ClearanceLevel.Restricted,
    isActive: true,
  },
];

export const accessLogsSeed: AccessLog[] = [
  { id: 'l1', userEmail: 'admin@dacms.gov', action: 'Created new role', createdAt: '2026-04-28T11:20:00Z' },
  { id: 'l2', userEmail: 'supervisor@dacms.gov', action: 'Updated user permissions', createdAt: '2026-04-28T12:05:00Z' },
];
