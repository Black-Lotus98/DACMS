'use client';

import { Bell, Menu } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useAppSelector } from '@/store/hooks';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAppSelector((s) => s.auth);

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
        <ThemeSwitcher style="icon" />
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <RoleBadge />
        {user && (
          <span className="text-sm text-muted-foreground hidden md:block">{user.name}</span>
        )}
      </div>
    </header>
  );
}
