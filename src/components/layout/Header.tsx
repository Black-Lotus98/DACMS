'use client';

import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RoleBadge } from './RoleBadge';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useAppSelector } from '@/store/hooks';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAppSelector((s) => s.auth);
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const { local } = useParams<{ local: string }>();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-muted transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-primary-a0 hidden sm:block">DACMS</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <Link
          href={`/${local}/notifications`}
          className="relative p-2 rounded-md hover:bg-muted transition-colors"
          aria-label={`Notifications — ${unreadCount} unread`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 end-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        <RoleBadge />
        {user && (
          <span className="text-sm text-muted-foreground hidden md:block">{user.name}</span>
        )}
      </div>
    </header>
  );
}
