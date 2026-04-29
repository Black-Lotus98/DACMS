import { http, HttpResponse } from 'msw';
import { lendingRequestsSeed, dispatchesSeed } from '@/features/m6-lending/data';

export const lendingHandlers = [
  http.get('/api/lending/requests', () => HttpResponse.json(lendingRequestsSeed)),
  http.get('/api/lending/dispatches', () => HttpResponse.json(dispatchesSeed)),
  http.post('/api/lending/requests', async ({ request }) => HttpResponse.json(await request.json())),
  http.put('/api/lending/requests/status', async ({ request }) => HttpResponse.json(await request.json())),
];
