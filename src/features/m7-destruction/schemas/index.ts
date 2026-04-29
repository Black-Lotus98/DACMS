import { z } from 'zod';

export const destructionRequestSchema = z.object({
  recordRef: z.string().min(1),
  reason: z.string().min(3),
});

export const migrationRequestSchema = z.object({
  recordRef: z.string().min(1),
  target: z.string().min(2),
  type: z.string().min(1),
});
