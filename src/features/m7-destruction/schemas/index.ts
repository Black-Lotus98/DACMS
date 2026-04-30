import { z } from 'zod';
import { MigrationType } from '../types';

export const destructionRequestSchema = z.object({
  requesterId:   z.string().min(1),
  justification: z.string().min(3),
  legalBasis:    z.string().min(3).optional(),
  recordIds:     z.array(z.string().min(1)).min(1),
});

export const rejectDestructionSchema = z.object({
  requestId:       z.string().min(1),
  rejectedBy:      z.string().min(1),
  rejectionReason: z.string().min(3),
});

export const executeDestructionSchema = z.object({
  requestId:   z.string().min(1),
  certificate: z.string().min(1),
});

export const migrationRequestSchema = z.object({
  requesterId: z.string().min(1),
  destination: z.string().min(2),
  type:        z.nativeEnum(MigrationType),
  recordIds:   z.array(z.string().min(1)).min(1),
});
