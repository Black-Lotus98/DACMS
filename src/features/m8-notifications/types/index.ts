export enum NotificationType {
  TaskAssigned = 'TASK_ASSIGNED',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Overdue = 'OVERDUE',
  Expiry = 'EXPIRY',
  SlaBreach = 'SLA_BREACH',
  CapacityAlert = 'CAPACITY_ALERT',
}

export enum NotificationChannel {
  InApp = 'IN_APP',
  Email = 'EMAIL',
  Both = 'BOTH',
  None = 'NONE',
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  link?: string;
  isRead: boolean;
  channel: NotificationChannel;
  createdAt: string;
}

export interface NotificationPreference {
  prefId: string;
  userId: string;
  notifType: NotificationType;
  channel: NotificationChannel;
}

export interface NotificationsState {
  items: NotificationItem[];
  preferences: NotificationPreference[];
  unreadCount: number;
}
