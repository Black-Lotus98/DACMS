import { NotificationType, type NotificationItem, type NotificationPreferences } from '../types';

export const notificationsSeed: NotificationItem[] = [
  { id: 'n1', title: 'Overdue lending request', message: 'الطلب LR-002 تجاوز تاريخ Due date', type: NotificationType.Warning, read: false, createdAt: '2026-04-29T09:00:00Z' },
  { id: 'n2', title: 'Approve Destroy مطلوب', message: 'الطلب DR-001 يحتاج Approve المستوى الثالث', type: NotificationType.Critical, read: false, createdAt: '2026-04-29T10:30:00Z' },
  { id: 'n3', title: 'Sync successful', message: 'Archive data synchronized successfully', type: NotificationType.Info, read: true, createdAt: '2026-04-29T12:00:00Z' },
];

export const notificationPreferencesSeed: NotificationPreferences = {
  email: true,
  inApp: true,
  overdueAlerts: true,
};
