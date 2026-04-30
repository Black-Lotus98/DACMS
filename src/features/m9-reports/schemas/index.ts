import { z } from 'zod';
import { ReportType, ExportFormat } from '../types';

export const reportFiltersSchema = z.object({
  dateFrom:     z.string().optional(),
  dateTo:       z.string().optional(),
  departmentId: z.string().optional(),
  docTypeId:    z.string().optional(),
  roomId:       z.string().optional(),
  officerId:    z.string().optional(),
  status:       z.string().optional(),
});

export const reportScheduleSchema = z.object({
  cron:       z.string().min(1),
  recipients: z.array(z.string().email()),
});

export const reportDefinitionSchema = z.object({
  id:          z.string().min(1),
  nameAr:      z.string().min(1),
  nameEn:      z.string().min(1),
  type:        z.nativeEnum(ReportType),
  createdBy:   z.string(),
  filters:     reportFiltersSchema,
  schedule:    reportScheduleSchema.optional(),
  recipients:  z.array(z.string()).optional(),
});

export const exportFormatSchema = z.nativeEnum(ExportFormat);
