import { RoleType } from './roles';
import type { NavItem } from '@/types';

const ALL = Object.values(RoleType);
const STAFF = [RoleType.CenterDirector, RoleType.ArchiveSupervisor, RoleType.ArchiveOfficer, RoleType.Admin];
const MANAGEMENT = [RoleType.CenterDirector, RoleType.ArchiveSupervisor, RoleType.Admin];

export const navigationConfig: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ALL,
  },
  {
    key: 'permissions',
    label: 'Users & Permissions',
    href: '/permissions',
    icon: 'ShieldCheck',
    roles: [RoleType.Admin, RoleType.CenterDirector],
  },
  {
    key: 'org-structure',
    label: 'Org Structure',
    href: '/org-structure',
    icon: 'Network',
    roles: MANAGEMENT,
  },
  {
    key: 'archive-structure',
    label: 'Archive Structure',
    href: '/archive-structure',
    icon: 'Warehouse',
    roles: STAFF,
  },
  {
    key: 'data-models',
    label: 'Data Models',
    href: '/data-models',
    icon: 'Database',
    roles: MANAGEMENT,
  },
  {
    key: 'records',
    label: 'Records',
    href: '/records',
    icon: 'FileText',
    roles: STAFF,
  },
  {
    key: 'search',
    label: 'Search',
    href: '/search',
    icon: 'Search',
    roles: ALL,
  },
  {
    key: 'barcodes',
    label: 'Barcodes',
    href: '/barcodes',
    icon: 'Barcode',
    roles: STAFF,
  },
  {
    key: 'lending',
    label: 'Lending Requests',
    href: '/lending',
    icon: 'BookOpen',
    roles: ALL,
  },
  {
    key: 'destruction',
    label: 'Destruction & Migration',
    href: '/destruction',
    icon: 'Trash2',
    roles: MANAGEMENT,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'Bell',
    roles: ALL,
  },
  {
    key: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
    roles: MANAGEMENT,
  },
  {
    key: 'integration',
    label: 'Integration',
    href: '/integration',
    icon: 'Plug',
    roles: [RoleType.Admin, RoleType.CenterDirector],
  },
  {
    key: 'kpi',
    label: 'KPI Dashboard',
    href: '/kpi',
    icon: 'TrendingUp',
    roles: MANAGEMENT,
  },
  {
    key: 'workflow',
    label: 'Workflow',
    href: '/workflow',
    icon: 'GitBranch',
    roles: STAFF,
    children: [
      { key: 'workflow-tasks',      label: 'My Tasks',     href: '/workflow/my-tasks',   icon: 'ClipboardList', roles: STAFF },
      { key: 'workflow-executions', label: 'Executions',   href: '/workflow/executions', icon: 'Play',          roles: STAFF },
      { key: 'workflow-analytics',  label: 'Analytics',    href: '/workflow/analytics',  icon: 'BarChart2',     roles: MANAGEMENT },
      { key: 'workflow-new',        label: 'New Workflow',  href: '/workflow/new',        icon: 'Plus',          roles: [RoleType.Admin] },
    ],
  },
  {
    key: 'kpi-linking',
    label: 'KPI Linking',
    href: '/kpi-linking',
    icon: 'Link',
    roles: [RoleType.CenterDirector, RoleType.Admin],
  },
];

export function getNavForRole(role: RoleType): NavItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role));
}
