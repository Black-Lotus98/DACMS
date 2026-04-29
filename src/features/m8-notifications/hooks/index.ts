import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useNotificationsModule() {
  const state = useAppSelector((s) => s.notifications);
  return useMemo(() => ({
    items: state.items,
    unreadCount: state.unreadCount,
    preferences: state.preferences,
  }), [state]);
}
