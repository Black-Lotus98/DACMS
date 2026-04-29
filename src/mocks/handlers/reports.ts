import { http, HttpResponse } from 'msw';
import { reportsSeed } from '@/features/m9-reports/data';
export const reportsHandlers = [http.get('/api/reports',()=>HttpResponse.json(reportsSeed))];
