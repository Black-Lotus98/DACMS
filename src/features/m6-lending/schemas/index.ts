import { z } from 'zod';

export const createLendingSchema = z.object({
  requester: z.string().min(2),
  recordRef: z.string().min(1),
  purpose: z.string().min(3),
  dueDate: z.string().min(1),
});

export const approveLendingSchema = z.object({
  requestId: z.string().min(1),
  approved: z.boolean(),
});
