import { RoleType } from './roles';
import type { NavItem } from '@/types';

const ALL = Object.values(RoleType);
const STAFF = [RoleType.CenterDirector, RoleType.ArchiveSupervisor, RoleType.ArchiveOfficer, RoleType.Admin];
const MANAGEMENT = [RoleType.CenterDirector, RoleType.ArchiveSupervisor, RoleType.Admin];

export const navigationConfig: NavItem[] = [
  {
    key: 'dashboard',
    label: 'لوحة التحكم',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ALL,
  },
  {
    key: 'permissions',
    label: 'المستخدمون والصلاحيات',
    href: '/permissions',
    icon: 'ShieldCheck',
    roles: [RoleType.Admin, RoleType.CenterDirector],
  },
  {
    key: 'org-structure',
    label: 'الهيكل التنظيمي',
    href: '/org-structure',
    icon: 'Network',
    roles: MANAGEMENT,
  },
  {
    key: 'archive-structure',
    label: 'هيكل الأرشيف',
    href: '/archive-structure',
    icon: 'Warehouse',
    roles: STAFF,
  },
  {
    key: 'data-models',
    label: 'النماذج والبيانات',
    href: '/data-models',
    icon: 'Database',
    roles: MANAGEMENT,
  },
  {
    key: 'records',
    label: 'تسجيل الوثائق',
    href: '/records',
    icon: 'FileText',
    roles: STAFF,
  },
  {
    key: 'search',
    label: 'البحث والاسترجاع',
    href: '/search',
    icon: 'Search',
    roles: ALL,
  },
  {
    key: 'barcodes',
    label: 'إدارة الباركود',
    href: '/barcodes',
    icon: 'Barcode',
    roles: STAFF,
  },
  {
    key: 'lending',
    label: 'طلبات الإعارة',
    href: '/lending',
    icon: 'BookOpen',
    roles: ALL,
  },
  {
    key: 'destruction',
    label: 'الإتلاف والترحيل',
    href: '/destruction',
    icon: 'Trash2',
    roles: MANAGEMENT,
  },
  {
    key: 'notifications',
    label: 'الإشعارات',
    href: '/notifications',
    icon: 'Bell',
    roles: ALL,
  },
  {
    key: 'reports',
    label: 'التقارير والإحصاءات',
    href: '/reports',
    icon: 'BarChart3',
    roles: MANAGEMENT,
  },
  {
    key: 'integration',
    label: 'التكامل التقني',
    href: '/integration',
    icon: 'Plug',
    roles: [RoleType.Admin, RoleType.CenterDirector],
  },
  {
    key: 'kpi',
    label: 'مؤشرات الأداء',
    href: '/kpi',
    icon: 'TrendingUp',
    roles: MANAGEMENT,
  },
  {
    key: 'workflow',
    label: 'سير العمل',
    href: '/workflow',
    icon: 'GitBranch',
    roles: STAFF,
  },
  {
    key: 'kpi-linking',
    label: 'ربط الهيكل بالمؤشرات',
    href: '/kpi-linking',
    icon: 'Link',
    roles: [RoleType.CenterDirector, RoleType.Admin],
  },
];

export function getNavForRole(role: RoleType): NavItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role));
}
