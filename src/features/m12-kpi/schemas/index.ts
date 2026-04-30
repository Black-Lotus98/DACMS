import { z } from 'zod';
import { KpiGroup, KpiUnit } from '../types';

export const kpiDefinitionSchema = z.object({
  id:             z.string().min(1),
  key:            z.string().min(1),
  nameAr:         z.string().min(1),
  nameEn:         z.string().min(1),
  formula:        z.string().min(1),
  targetValue:    z.number().optional(),
  unit:           z.nativeEnum(KpiUnit),
  group:          z.nativeEnum(KpiGroup),
  roleScope:      z.array(z.string()),
  higherIsBetter: z.boolean(),
});

export const kpiSnapshotSchema = z.object({
  id:         z.string().min(1),
  kpiId:      z.string().min(1),
  value:      z.number(),
  period:     z.string().regex(/^\d{4}-\d{2}$/),
  computedAt: z.string(),
});

export const updateTargetValueSchema = z.object({
  id:          z.string().min(1),
  targetValue: z.number().min(0),
});
