import { z } from 'zod';

export const workflowSchema = z.object({
  name: z.string().min(2),
  status: z.string().min(1),
});

export const workflowStepSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(1),
  slaHours: z.number().min(1),
  order: z.number().min(1),
});
