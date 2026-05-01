import { z } from 'zod';
import { AssigneeType, StepType, TriggerType, WorkflowStatus, WorkflowType } from '../types';

export const stepActionRecordSchema = z.object({
  stepId:  z.string(),
  action:  z.string().min(1),
  actorId: z.string(),
  takenAt: z.string(),
  comment: z.string().optional(),
});

export const workflowEdgeSchema = z.object({
  id:     z.string(),
  source: z.string(),
  target: z.string(),
  label:  z.string().optional(),
});

export const workflowStepSchema = z.object({
  id:           z.string(),
  nameAr:       z.string().min(2),
  nameEn:       z.string().min(2),
  stepType:     z.nativeEnum(StepType),
  assigneeType: z.nativeEnum(AssigneeType).optional(),
  assigneeId:   z.string().optional(),
  slaHours:     z.number().int().min(1).optional(),
  actions:      z.array(z.string().min(1)).optional(),
  triggerType:  z.nativeEnum(TriggerType).optional(),
  posX:         z.number().optional(),
  posY:         z.number().optional(),
});

export const workflowSchema = z.object({
  nameAr:   z.string().min(2),
  nameEn:   z.string().min(2),
  type:     z.nativeEnum(WorkflowType),
  status:   z.nativeEnum(WorkflowStatus).optional(),
  parentId: z.string().optional(),
  steps:    z.array(workflowStepSchema).min(1),
  edges:    z.array(workflowEdgeSchema),
}).superRefine((val, ctx) => {
  const triggers = val.steps.filter((s) => s.stepType === StepType.Trigger);
  if (triggers.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Workflow must have exactly one TRIGGER step.', path: ['steps'] });
  }
  if (triggers.length > 1) {
    ctx.addIssue({ code: 'custom', message: 'Workflow cannot have more than one TRIGGER step.', path: ['steps'] });
  }

  const hasHuman = val.steps.some((s) => s.stepType === StepType.Human);
  if (!hasHuman) {
    ctx.addIssue({ code: 'custom', message: 'Workflow must include at least one HUMAN step.', path: ['steps'] });
  }

  const stepIds = new Set(val.steps.map((s) => s.id));
  for (const edge of val.edges) {
    if (!stepIds.has(edge.source)) {
      ctx.addIssue({ code: 'custom', message: `Edge source "${edge.source}" does not match any step.`, path: ['edges'] });
    }
    if (!stepIds.has(edge.target)) {
      ctx.addIssue({ code: 'custom', message: `Edge target "${edge.target}" does not match any step.`, path: ['edges'] });
    }
  }

  for (const step of val.steps) {
    if (step.stepType === StepType.Trigger) continue;
    const hasIncoming = val.edges.some((e) => e.target === step.id);
    if (!hasIncoming) {
      ctx.addIssue({ code: 'custom', message: `Step "${step.nameEn}" has no incoming edge (unreachable).`, path: ['edges'] });
    }
  }

  for (const step of val.steps.filter((s) => s.stepType === StepType.Decision)) {
    const outgoing = val.edges.filter((e) => e.source === step.id);
    if (outgoing.length < 2) {
      ctx.addIssue({ code: 'custom', message: `Decision step "${step.nameEn}" must have at least 2 outgoing edges.`, path: ['edges'] });
    }
  }

  const triggerStep = triggers[0];
  if (triggerStep) {
    const triggerHasIncoming = val.edges.some((e) => e.target === triggerStep.id);
    if (triggerHasIncoming) {
      ctx.addIssue({ code: 'custom', message: 'TRIGGER step cannot have incoming edges.', path: ['edges'] });
    }
    const triggerOutgoing = val.edges.filter((e) => e.source === triggerStep.id);
    if (triggerOutgoing.length !== 1) {
      ctx.addIssue({ code: 'custom', message: 'TRIGGER step must have exactly one outgoing edge.', path: ['edges'] });
    }
  }
});

export const workflowExecutionSchema = z.object({
  id:                   z.string(),
  wfId:                 z.string(),
  entityType:           z.string().min(1),
  entityId:             z.string().min(1),
  status:               z.string(),
  currentStepId:        z.string().optional(),
  startedAt:            z.string(),
  currentStepStartedAt: z.string().optional(),
  completedAt:          z.string().optional(),
  escalatedTo:          z.string().optional(),
  actionHistory:        z.array(stepActionRecordSchema),
});
