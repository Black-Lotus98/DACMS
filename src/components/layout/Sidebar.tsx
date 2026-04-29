'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { getNavForRole } from '@/config/navigation';
import {
  LayoutDashboard, ShieldCheck, Network, Warehouse, Database,
  FileText, Search, Barcode, BookOpen, Trash2, Bell, BarChart3,
  Plug, TrendingUp, GitBranch, Link as LinkIcon,
} from 'lucide-react';
import type { RoleType } from '@/config/roles';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, ShieldCheck, Network, Warehouse, Database,
  FileText, Search, Barcode, BookOpen, Trash2, Bell, BarChart3,
  Plug, TrendingUp, GitBranch, Link: LinkIcon,
};

interface SidebarProps {
  locale: string;
  onClose?: () => void;
}

export function Sidebar({ locale, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAppSelector((s) => s.auth);
  const items = role ? getNavForRole(role as RoleType) : [];

  return (
    <aside className="h-full w-64 border-e bg-background flex flex-col">
      <div className="h-16 flex items-center px-4 border-b">
        <span className="font-bold text-lg text-primary-a0">DACMS</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item) => {
          const href = `/${locale}${item.href}`;
          const active = pathname.startsWith(href);
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          return (
            <Link
              key={item.key}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-primary-a0 text-white font-medium'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
