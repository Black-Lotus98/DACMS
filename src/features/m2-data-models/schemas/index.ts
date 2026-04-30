import { z } from 'zod';
import { ActionAfter, FieldType } from '../types';

export const documentTypeSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  code: z.string().min(1),
  description: z.string().optional(),
});

export const categorySchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  code: z.string().min(1),
  docTypeId: z.string().min(1),
  parentId: z.string().optional(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export const metadataFieldSchema = z.object({
  fieldKey: z.string().min(1),
  labelAr: z.string().min(2),
  labelEn: z.string().min(2),
  fieldType: z.nativeEnum(FieldType),
  isRequired: z.boolean(),
  defaultVal: z.string().optional(),
  optionSetId: z.string().optional(),
  docTypeId: z.string().min(1),
});

export const retentionPolicySchema = z.object({
  docTypeId: z.string().min(1),
  periodYears: z.number().int().min(1),
  actionAfter: z.nativeEnum(ActionAfter),
  legalRef: z.string().optional(),
});

export const optionSetSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  options: z.array(z.string().min(1)).min(1),
});
