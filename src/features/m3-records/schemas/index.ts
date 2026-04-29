import { z } from 'zod';

export const registerRecordSchema = z.object({
  title: z.string().min(2),
  docType: z.string().min(1),
  boxCode: z.string().min(1),
  secrecy: z.string().min(1),
});

export const moveRecordSchema = z.object({
  recordId: z.string().min(1),
  toBox: z.string().min(1),
});
