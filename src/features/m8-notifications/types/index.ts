export enum NotificationType { Info='info', Warning='warning', Critical='critical' }

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  overdueAlerts: boolean;
}

export interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
  preferences: NotificationPreferences;
}
