import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useNotificationsModule() {
  const state = useAppSelector((s) => s.notifications);
  return useMemo(() => ({
    items: state.items,
    unreadItems: state.items.filter((item) => !item.read),
    unreadCount: state.unreadCount,
    preferences: state.preferences,
  }), [state]);
}
