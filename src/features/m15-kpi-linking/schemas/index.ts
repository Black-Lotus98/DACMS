import { z } from 'zod';
export const kpiMappingSchema = z.object({
  role: z.string().min(1),
  kpiKeys: z.array(z.string()),
  displayOrder: z.array(z.string()).optional(),
  primaryKpiKey: z.string().optional(),
});
