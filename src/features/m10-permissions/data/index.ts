import { RoleType, ClearanceLevel, RoleAssignmentType } from '../types';
import type {
  AccessLog,
  LdapConfig,
  LocationAccessRule,
  Permission,
  PermissionGroup,
  PasswordPolicy,
  RoleEntity,
  UserEntity,
} from '../types';

// ─── permissions ────────────────────────────────────────────────────────────

export const permissionsSeed: Permission[] = [
  // Records (M3)
  { id: 'p-rec-read',    permKey: 'records.read',       module: 'm3-records',      labelAr: 'عرض السجلات',           labelEn: 'View Records' },
  { id: 'p-rec-create',  permKey: 'records.create',     module: 'm3-records',      labelAr: 'إنشاء سجل جديد',        labelEn: 'Create Record' },
  { id: 'p-rec-edit',    permKey: 'records.edit',       module: 'm3-records',      labelAr: 'تعديل السجلات',         labelEn: 'Edit Records' },
  { id: 'p-rec-delete',  permKey: 'records.delete',     module: 'm3-records',      labelAr: 'حذف السجلات',           labelEn: 'Delete Records' },
  { id: 'p-rec-import',  permKey: 'records.import',     module: 'm3-records',      labelAr: 'استيراد السجلات',       labelEn: 'Bulk Import Records' },
  // Archive Structure (M1)
  { id: 'p-arch-view',   permKey: 'archive.view',       module: 'm1-archive',      labelAr: 'عرض هيكل الأرشيف',      labelEn: 'View Archive Structure' },
  { id: 'p-arch-manage', permKey: 'archive.manage',     module: 'm1-archive',      labelAr: 'إدارة هيكل الأرشيف',    labelEn: 'Manage Archive Structure' },
  // Search (M4)
  { id: 'p-srch-basic',  permKey: 'search.basic',       module: 'm4-search',       labelAr: 'البحث الأساسي',         labelEn: 'Basic Search' },
  { id: 'p-srch-adv',    permKey: 'search.advanced',    module: 'm4-search',       labelAr: 'البحث المتقدم',         labelEn: 'Advanced Search' },
  // Lending (M6)
  { id: 'p-lend-view',   permKey: 'lending.view',       module: 'm6-lending',      labelAr: 'عرض طلبات الإعارة',     labelEn: 'View Lending Requests' },
  { id: 'p-lend-create', permKey: 'lending.create',     module: 'm6-lending',      labelAr: 'إنشاء طلب إعارة',       labelEn: 'Create Lending Request' },
  { id: 'p-lend-approve',permKey: 'lending.approve',    module: 'm6-lending',      labelAr: 'الموافقة على الإعارة',  labelEn: 'Approve Lending' },
  // Destruction (M7)
  { id: 'p-dest-view',   permKey: 'destruction.view',   module: 'm7-destruction',  labelAr: 'عرض طلبات الإتلاف',     labelEn: 'View Destruction Requests' },
  { id: 'p-dest-create', permKey: 'destruction.create', module: 'm7-destruction',  labelAr: 'إنشاء طلب إتلاف',       labelEn: 'Create Destruction Request' },
  { id: 'p-dest-approve',permKey: 'destruction.approve',module: 'm7-destruction',  labelAr: 'الموافقة على الإتلاف',  labelEn: 'Approve Destruction' },
  { id: 'p-dest-exec',   permKey: 'destruction.execute',module: 'm7-destruction',  labelAr: 'تنفيذ الإتلاف',         labelEn: 'Execute Destruction' },
  // Barcodes (M5)
  { id: 'p-bar-view',    permKey: 'barcodes.view',      module: 'm5-barcodes',     labelAr: 'عرض الباركود',          labelEn: 'View Barcodes' },
  { id: 'p-bar-print',   permKey: 'barcodes.print',     module: 'm5-barcodes',     labelAr: 'طباعة الباركود',        labelEn: 'Print Barcodes' },
  // Reports (M9)
  { id: 'p-rep-view',    permKey: 'reports.view',       module: 'm9-reports',      labelAr: 'عرض التقارير',          labelEn: 'View Reports' },
  { id: 'p-rep-export',  permKey: 'reports.export',     module: 'm9-reports',      labelAr: 'تصدير التقارير',        labelEn: 'Export Reports' },
  { id: 'p-rep-schedule',permKey: 'reports.schedule',   module: 'm9-reports',      labelAr: 'جدولة التقارير',        labelEn: 'Schedule Reports' },
  // Workflow (M14)
  { id: 'p-wfl-view',    permKey: 'workflow.view',      module: 'm14-workflow',    labelAr: 'عرض مسارات العمل',      labelEn: 'View Workflows' },
  { id: 'p-wfl-manage',  permKey: 'workflow.manage',    module: 'm14-workflow',    labelAr: 'إدارة مسارات العمل',    labelEn: 'Manage Workflows' },
  // Users (M10)
  { id: 'p-usr-view',    permKey: 'users.view',         module: 'm10-permissions', labelAr: 'عرض المستخدمين',        labelEn: 'View Users' },
  { id: 'p-usr-manage',  permKey: 'users.manage',       module: 'm10-permissions', labelAr: 'إدارة المستخدمين',      labelEn: 'Manage Users' },
];

// ─── permission groups ───────────────────────────────────────────────────────

export const permissionGroupsSeed: PermissionGroup[] = [
  {
    id: 'pg1',
    nameAr: 'صلاحيات موظف الأرشيف',
    nameEn: 'Archive Officer Bundle',
    permissionKeys: ['records.read', 'records.create', 'archive.view', 'search.basic', 'lending.view', 'lending.create', 'barcodes.view', 'barcodes.print'],
  },
  {
    id: 'pg2',
    nameAr: 'صلاحيات مشرف الأرشيف',
    nameEn: 'Archive Supervisor Bundle',
    permissionKeys: ['records.read', 'records.create', 'records.edit', 'archive.view', 'archive.manage', 'search.basic', 'search.advanced', 'lending.view', 'lending.create', 'lending.approve', 'destruction.view', 'destruction.approve', 'reports.view', 'reports.export', 'workflow.view'],
  },
  {
    id: 'pg3',
    nameAr: 'صلاحيات المدير',
    nameEn: 'Director Bundle',
    permissionKeys: permissionsSeed.map((p) => p.permKey),
  },
];

// ─── roles ───────────────────────────────────────────────────────────────────

export const rolesSeed: RoleEntity[] = [
  {
    id: 'r1',
    type: RoleType.CenterDirector,
    nameAr: 'مدير مركز الوثائق',
    nameEn: 'Center Director',
    assignmentType: RoleAssignmentType.OnePerOrg,
    description: 'Top-level authority over the entire document and archive centre.',
    permissionKeys: permissionsSeed.map((p) => p.permKey),
    permissionGroupIds: ['pg3'],
  },
  {
    id: 'r2',
    type: RoleType.ArchiveSupervisor,
    nameAr: 'مشرف الأرشيف',
    nameEn: 'Archive Supervisor',
    assignmentType: RoleAssignmentType.OnePerDept,
    description: 'Oversees daily archive operations and approves lending and destruction.',
    permissionKeys: permissionGroupsSeed[1].permissionKeys,
    permissionGroupIds: ['pg2'],
  },
  {
    id: 'r3',
    type: RoleType.ArchiveOfficer,
    nameAr: 'موظف الأرشيف',
    nameEn: 'Archive Officer',
    assignmentType: RoleAssignmentType.MultiUser,
    description: 'Registers, moves, and manages physical records.',
    permissionKeys: permissionGroupsSeed[0].permissionKeys,
    permissionGroupIds: ['pg1'],
  },
  {
    id: 'r4',
    type: RoleType.Admin,
    nameAr: 'مدير النظام',
    nameEn: 'System Administrator',
    assignmentType: RoleAssignmentType.OnePerOrg,
    description: 'Full system access including user management and security configuration.',
    permissionKeys: permissionsSeed.map((p) => p.permKey),
    permissionGroupIds: ['pg3'],
  },
  {
    id: 'r5',
    type: RoleType.Beneficiary,
    nameAr: 'مستفيد',
    nameEn: 'Beneficiary',
    assignmentType: RoleAssignmentType.MultiUser,
    description: 'External user who can submit lending requests via the public portal.',
    permissionKeys: ['search.basic', 'lending.create', 'lending.view'],
    permissionGroupIds: [],
  },
];

// ─── users ───────────────────────────────────────────────────────────────────

export const usersSeed: UserEntity[] = [
  {
    id: 'u1',
    username: 'admin',
    nameAr: 'سارة الغامدي',
    nameEn: 'Sarah Al-Ghamdi',
    email: 'admin@dacms.gov',
    clearanceLevel: ClearanceLevel.TopSecret,
    roleIds: ['r4'],
    permissionGroupIds: ['pg3'],
    isActive: true,
    authSource: 'LOCAL',
    lastLogin: '2026-04-30T08:00:00Z',
  },
  {
    id: 'u2',
    username: 'supervisor',
    nameAr: 'فاطمة العمري',
    nameEn: 'Fatimah Al-Omari',
    email: 'supervisor@dacms.gov',
    deptId: 'dept-1',
    clearanceLevel: ClearanceLevel.Confidential,
    roleIds: ['r2'],
    permissionGroupIds: ['pg2'],
    isActive: true,
    authSource: 'LOCAL',
    lastLogin: '2026-04-30T09:15:00Z',
  },
  {
    id: 'u3',
    username: 'officer1',
    nameAr: 'محمد القحطاني',
    nameEn: 'Mohammad Al-Qahtani',
    email: 'officer@dacms.gov',
    deptId: 'dept-1',
    clearanceLevel: ClearanceLevel.Restricted,
    roleIds: ['r3'],
    permissionGroupIds: ['pg1'],
    isActive: true,
    authSource: 'LOCAL',
    lastLogin: '2026-04-29T14:00:00Z',
  },
  {
    id: 'u4',
    username: 'director',
    nameAr: 'أحمد الزهراني',
    nameEn: 'Ahmad Al-Zahrani',
    email: 'director@dacms.gov',
    clearanceLevel: ClearanceLevel.TopSecret,
    roleIds: ['r1'],
    permissionGroupIds: ['pg3'],
    isActive: true,
    authSource: 'LDAP',
    lastLogin: '2026-04-28T11:30:00Z',
  },
  {
    id: 'u5',
    username: 'officer2',
    nameAr: 'نورة السبيعي',
    nameEn: 'Noura Al-Subai',
    email: 'officer2@dacms.gov',
    deptId: 'dept-2',
    clearanceLevel: ClearanceLevel.Restricted,
    roleIds: ['r3'],
    permissionGroupIds: ['pg1'],
    isActive: false,
    authSource: 'LOCAL',
    lastLogin: '2026-04-10T10:00:00Z',
  },
];

// ─── access logs ─────────────────────────────────────────────────────────────

export const accessLogsSeed: AccessLog[] = [
  { id: 'al1', userId: 'u1', action: 'CREATE', entityType: 'User',    entityId: 'u3',    ipAddress: '192.168.1.10', timestamp: '2026-04-29T08:12:00Z' },
  { id: 'al2', userId: 'u2', action: 'APPROVE',entityType: 'LendingRequest', entityId: 'lr1', ipAddress: '192.168.1.22', timestamp: '2026-04-29T09:30:00Z' },
  { id: 'al3', userId: 'u3', action: 'CREATE', entityType: 'Record',  entityId: 'rec1',  ipAddress: '192.168.1.35', timestamp: '2026-04-29T10:05:00Z' },
  { id: 'al4', userId: 'u1', action: 'UPDATE', entityType: 'Role',    entityId: 'r3',    ipAddress: '192.168.1.10', timestamp: '2026-04-28T14:20:00Z' },
  { id: 'al5', userId: 'u2', action: 'REJECT', entityType: 'DestructionRequest', entityId: 'dr1', ipAddress: '192.168.1.22', timestamp: '2026-04-28T16:00:00Z' },
];

// ─── password policy ─────────────────────────────────────────────────────────

export const defaultPasswordPolicy: PasswordPolicy = {
  minLength:         8,
  requireUppercase:  true,
  requireNumbers:    true,
  requireSymbols:    false,
  expiryDays:        90,
  maxFailedAttempts: 5,
};

export const locationAccessRulesSeed: LocationAccessRule[] = [
  { id: 'lar-1', scopeType: 'ROOM', scopeId: 'R01', roleIds: ['r1', 'r2', 'r3'] },
  { id: 'lar-2', scopeType: 'SHELF', scopeId: 'SH-A-01', departmentIds: ['dept-1'] },
];

export const defaultLdapConfig: LdapConfig = {
  enabled: false,
  serverUrl: 'ldap://directory.gov.local:389',
  baseDn: 'dc=dacms,dc=gov,dc=local',
  bindUser: 'cn=service-account,ou=system,dc=dacms,dc=gov,dc=local',
};
