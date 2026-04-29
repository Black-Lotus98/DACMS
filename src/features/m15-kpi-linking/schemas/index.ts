import { z } from 'zod';
export const kpiMappingSchema = z.object({ role: z.string().min(1), kpiKeys: z.array(z.string()).min(1) });
