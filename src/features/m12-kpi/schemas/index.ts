import { z } from 'zod';
export const kpiFilterSchema = z.object({ role: z.string().optional() });
