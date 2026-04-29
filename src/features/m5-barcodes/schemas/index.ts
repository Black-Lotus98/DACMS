import { z } from 'zod';
export const generateBarcodeSchema = z.object({ entityId: z.string().min(1), type: z.string().min(1) });
export const batchPrintSchema = z.object({ labelIds: z.array(z.string()).min(1) });
