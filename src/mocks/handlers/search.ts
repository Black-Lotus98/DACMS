import { http, HttpResponse } from 'msw';
import { savedQueriesSeed, searchResultsSeed } from '@/features/m4-search/data';

export const searchHandlers = [
  http.post('/api/search', () => HttpResponse.json(searchResultsSeed)),
  http.get('/api/search/saved', () => HttpResponse.json(savedQueriesSeed)),
  http.post('/api/search/saved', async ({ request }) => HttpResponse.json(await request.json())),
];
