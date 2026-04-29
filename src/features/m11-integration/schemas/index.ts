import { z } from 'zod';
export const apiKeySchema = z.object({ name: z.string().min(2) });
export const webhookSchema = z.object({ url: z.string().url(), event: z.string().min(1) });
