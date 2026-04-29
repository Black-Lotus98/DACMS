import { http, HttpResponse } from 'msw';
import { mappingsSeed } from '@/features/m15-kpi-linking/data';
export const kpiLinkingHandlers=[http.get('/api/kpi-linking',()=>HttpResponse.json(mappingsSeed))];
