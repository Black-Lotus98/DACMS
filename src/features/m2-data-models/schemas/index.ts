import { z } from 'zod';

export const documentTypeSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  retentionPolicyId: z.string().min(1),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  parentId: z.string().optional(),
  docTypeId: z.string().min(1),
});

export const metadataFieldSchema = z.object({
  label: z.string().min(2),
  fieldType: z.string().min(1),
  required: z.boolean(),
  docTypeId: z.string().min(1),
  options: z.array(z.string()).optional(),
});

export const retentionPolicySchema = z.object({
  name: z.string().min(2),
  periodYears: z.number().min(1),
  actionAfter: z.string().min(1),
});
