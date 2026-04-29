import { NotificationType, type NotificationItem, type NotificationPreferences } from '../types';

export const notificationsSeed: NotificationItem[] = [
  { id: 'n1', title: 'طلب إعارة متأخر', message: 'الطلب LR-002 تجاوز تاريخ الاستحقاق', type: NotificationType.Warning, read: false, createdAt: '2026-04-29T09:00:00Z' },
  { id: 'n2', title: 'اعتماد إتلاف مطلوب', message: 'الطلب DR-001 يحتاج اعتماد المستوى الثالث', type: NotificationType.Critical, read: false, createdAt: '2026-04-29T10:30:00Z' },
  { id: 'n3', title: 'مزامنة ناجحة', message: 'تمت مزامنة بيانات الأرشيف بنجاح', type: NotificationType.Info, read: true, createdAt: '2026-04-29T12:00:00Z' },
];

export const notificationPreferencesSeed: NotificationPreferences = {
  email: true,
  inApp: true,
  overdueAlerts: true,
};
