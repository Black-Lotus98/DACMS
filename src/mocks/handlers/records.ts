import { http, HttpResponse } from 'msw';
import { recordsSeed, locationHistorySeed } from '@/features/m3-records/data';

export const recordsHandlers = [
  http.get('/api/records', () => HttpResponse.json(recordsSeed)),
  http.get('/api/records/history', () => HttpResponse.json(locationHistorySeed)),
  http.post('/api/records', async ({ request }) => HttpResponse.json(await request.json())),
  http.post('/api/records/move', async ({ request }) => HttpResponse.json(await request.json())),
];
