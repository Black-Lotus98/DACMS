import { z } from 'zod';
export const searchFiltersSchema = z.object({ query: z.string().min(1), docType: z.string().optional(), secrecy: z.string().optional() });
export const saveQuerySchema = z.object({ name: z.string().min(2), query: z.string().min(1) });
