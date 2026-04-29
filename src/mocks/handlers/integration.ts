import { http, HttpResponse } from 'msw';
import { apiKeysSeed, webhooksSeed } from '@/features/m11-integration/data';
export const integrationHandlers=[http.get('/api/integration/api-keys',()=>HttpResponse.json(apiKeysSeed)),http.get('/api/integration/webhooks',()=>HttpResponse.json(webhooksSeed))];
