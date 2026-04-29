'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRole } from '@/store/authSlice';
import { ALL_ROLES, ROLE_LABELS, type RoleType } from '@/config/roles';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function RoleBadge() {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  if (!role) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-a0 text-white text-xs font-medium"
      >
        {ROLE_LABELS[role]}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-1 w-52 rounded-lg border bg-background shadow-lg z-50 py-1">
          <p className="px-3 py-1.5 text-xs text-muted-foreground">تغيير الدور</p>
          {ALL_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => { dispatch(setRole(r as RoleType)); setOpen(false); }}
              className={`w-full text-start px-3 py-2 text-sm hover:bg-muted transition-colors ${role === r ? 'text-primary font-semibold' : ''}`}
            >
              {ROLE_LABELS[r as RoleType]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
