import { z } from 'zod';
import { RecordStatus, SecrecyLevel } from '@/features/m3-records/types';

export const searchFiltersSchema = z.object({
  query:       z.string().default(''),
  docTypeId:   z.string().optional(),
  categoryId:  z.string().optional(),
  status:      z.nativeEnum(RecordStatus).optional(),
  secrecy:     z.nativeEnum(SecrecyLevel).optional(),
  dateFrom:    z.string().optional(),
  dateTo:      z.string().optional(),
  department:  z.string().optional(),
});

export const saveQuerySchema = z.object({
  name:   z.string().min(2),
  userId: z.string().min(1),
});

export const barcodeSearchSchema = z.object({
  barcode: z.string().min(1),
});
