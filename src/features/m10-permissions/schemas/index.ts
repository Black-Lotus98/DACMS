import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(1),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
});
