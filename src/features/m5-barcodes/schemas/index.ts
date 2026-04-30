import { z } from 'zod';
import { BarcodeType, EntityType } from '../types';

export const generateBarcodeSchema = z.object({
  entityType: z.nativeEnum(EntityType),
  entityId:   z.string().min(1),
  type:       z.nativeEnum(BarcodeType),
});

export const batchPrintSchema = z.object({
  labelIds:    z.array(z.string()).min(1),
  createdBy:   z.string().min(1),
  printFormat: z.string().min(1),
});

export const replaceBarcodeSchema = z.object({
  labelId:  z.string().min(1),
  type:     z.nativeEnum(BarcodeType),
});
