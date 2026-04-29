import { http, HttpResponse } from 'msw';
import { destructionRequestsSeed, migrationRequestsSeed } from '@/features/m7-destruction/data';

export const destructionHandlers = [
  http.get('/api/destruction/requests', () => HttpResponse.json(destructionRequestsSeed)),
  http.get('/api/destruction/migrations', () => HttpResponse.json(migrationRequestsSeed)),
  http.post('/api/destruction/requests', async ({ request }) => HttpResponse.json(await request.json())),
  http.post('/api/destruction/migrations', async ({ request }) => HttpResponse.json(await request.json())),
];
