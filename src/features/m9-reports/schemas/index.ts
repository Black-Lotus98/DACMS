import { z } from 'zod';
export const reportFilterSchema = z.object({ from: z.string().optional(), to: z.string().optional(), type: z.string().optional() });
