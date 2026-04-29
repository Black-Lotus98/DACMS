import { z } from 'zod';

export const notificationPreferenceSchema = z.object({
  email: z.boolean(),
  inApp: z.boolean(),
  overdueAlerts: z.boolean(),
});
