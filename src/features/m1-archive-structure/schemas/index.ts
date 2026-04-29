import { z } from 'zod';

export const roomSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(2),
  capacity: z.number().min(1),
});

export const shelfSchema = z.object({
  code: z.string().min(1),
  cabinetId: z.string().min(1),
  capacity: z.number().min(1),
});

export const boxSchema = z.object({
  code: z.string().min(1),
  shelfId: z.string().min(1),
});
