import { z } from 'zod';
import { LendingStatus } from '../types';

export const createLendingSchema = z.object({
  requesterId: z.string().min(1),
  deptId:      z.string().min(1),
  purpose:     z.string().min(3),
  recordIds:   z.array(z.string().min(1)).min(1).max(50),
  dueDate:     z.string().optional(),
});

export const approveLendingSchema = z.object({
  requestId:  z.string().min(1),
  approvedBy: z.string().min(1),
});

export const rejectLendingSchema = z.object({
  requestId:       z.string().min(1),
  rejectionReason: z.string().min(3),
});

export const dispatchSchema = z.object({
  requestId:   z.string().min(1),
  messengerId: z.string().min(1),
});

export const confirmReturnSchema = z.object({
  requestId: z.string().min(1),
  itemIds:   z.array(z.string()).min(1),
});
