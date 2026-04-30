import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { NotificationType } from '../types';

export function useNotificationsModule() {
  const state = useAppSelector((s) => s.notifications);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoIso = oneYearAgo.toISOString();

  return useMemo(() => ({
    items: state.items.filter((n) => n.createdAt >= oneYearAgoIso),
    unreadItems: state.items.filter((n) => !n.isRead && n.createdAt >= oneYearAgoIso),
    unreadCount: state.unreadCount,
    preferences: state.preferences,

    getByType: (type: NotificationType) =>
      state.items.filter((n) => n.type === type),

    getByReadStatus: (isRead: boolean) =>
      state.items.filter((n) => n.isRead === isRead),

    getByDateRange: (from: string, to: string) =>
      state.items.filter((n) => n.createdAt >= from && n.createdAt <= to),

    getOverdueAlerts: () =>
      state.items.filter((n) => n.type === NotificationType.Overdue),

    getExpiryAlerts: () =>
      state.items.filter((n) => n.type === NotificationType.Expiry),

    getCapacityAlerts: () =>
      state.items.filter((n) => n.type === NotificationType.CapacityAlert),

    getPreferenceForType: (type: NotificationType, userId = 'current-user') =>
      state.preferences.find((p) => p.notifType === type && p.userId === userId),
  }), [state, oneYearAgoIso]);
}
