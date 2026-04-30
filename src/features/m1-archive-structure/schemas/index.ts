import { z } from 'zod';

export const roomSchema = z.object({
  code: z.string().min(1),
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  capacity: z.number().int().min(1),
  deptIds: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

export const rowSchema = z.object({
  code: z.string().min(1),
  roomId: z.string().min(1),
  position: z.number().int().min(1),
  capacity: z.number().int().min(1),
});

export const cabinetSchema = z.object({
  code: z.string().min(1),
  rowId: z.string().min(1),
  shelfCount: z.number().int().min(1),
});

export const shelfSchema = z.object({
  code: z.string().min(1),
  cabinetId: z.string().min(1),
  capacity: z.number().int().min(1),
});

export const boxSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  shelfId: z.string().min(1),
});
