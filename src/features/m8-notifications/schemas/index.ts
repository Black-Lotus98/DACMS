import { z } from 'zod';
import { NotificationType, NotificationChannel } from '../types';

export const notificationSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: z.nativeEnum(NotificationType),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  bodyAr: z.string().min(1),
  bodyEn: z.string().min(1),
  link: z.string().optional(),
  isRead: z.boolean(),
  channel: z.nativeEnum(NotificationChannel),
  createdAt: z.string().datetime(),
});

export const notificationPreferenceSchema = z.object({
  prefId: z.string().min(1),
  userId: z.string().min(1),
  notifType: z.nativeEnum(NotificationType),
  channel: z.nativeEnum(NotificationChannel),
});
