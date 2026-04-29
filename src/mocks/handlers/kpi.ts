import { http, HttpResponse } from 'msw';
import { kpiSeed } from '@/features/m12-kpi/data';
export const kpiHandlers=[http.get('/api/kpi',()=>HttpResponse.json(kpiSeed))];
