import { z } from 'zod';
import { AssigneeType, StepType, WorkflowType } from '../types';

export const workflowStepSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  stepType: z.nativeEnum(StepType),
  assigneeType: z.nativeEnum(AssigneeType).optional(),
  slaHours: z.number().int().min(1).optional(),
  order: z.number().int().min(1),
});

export const workflowSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  type: z.nativeEnum(WorkflowType),
  steps: z.array(workflowStepSchema).min(1),
});
