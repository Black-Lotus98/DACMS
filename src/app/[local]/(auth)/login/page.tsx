'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setRole } from '@/store/authSlice';
import { ALL_ROLES, ROLE_LABELS, type RoleType } from '@/config/roles';
import {
  Crown, FolderArchive, FileStack, Settings, UserCheck,
} from 'lucide-react';

const ROLE_ICONS: Record<RoleType, React.ElementType> = {
  center_director: Crown,
  archive_supervisor: FolderArchive,
  archive_officer: FileStack,
  admin: Settings,
  beneficiary: UserCheck,
} as Record<RoleType, React.ElementType>;

const ROLE_COLORS: Record<RoleType, string> = {
  center_director: 'border-primary-a0 bg-primary-a90 hover:bg-primary-a80',
  archive_supervisor: 'border-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900',
  archive_officer: 'border-green-400 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900',
  admin: 'border-purple-400 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900',
  beneficiary: 'border-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800',
} as Record<RoleType, string>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { local } = useParams<{ local: string }>();

  function handleRoleSelect(role: RoleType) {
    dispatch(setRole(role));
    router.push(`/${local}/dashboard`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary-a0">DACMS</h1>
        <p className="text-muted-foreground text-sm">
          نظام إدارة مركز الوثائق والأرشيف — اختر دورك للمتابعة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full max-w-5xl">
        {ALL_ROLES.map((role) => {
          const Icon = ROLE_ICONS[role as RoleType];
          return (
            <button
              key={role}
              onClick={() => handleRoleSelect(role as RoleType)}
              className={`group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${ROLE_COLORS[role as RoleType]}`}
            >
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center shadow-sm">
                <Icon className="w-7 h-7 text-foreground" />
              </div>
              <span className="text-sm font-semibold text-center leading-snug">
                {ROLE_LABELS[role as RoleType]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">بيئة تجريبية — للعرض والتطوير فقط</p>
    </div>
  );
}
