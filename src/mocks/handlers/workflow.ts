import { http, HttpResponse } from 'msw';
import { executionsSeed, workflowsSeed } from '@/features/m14-workflow/data';

export const workflowHandlers = [
  http.get('/api/workflows', () => HttpResponse.json(workflowsSeed)),
  http.get('/api/workflow/executions', () => HttpResponse.json(executionsSeed)),
  http.post('/api/workflows', async ({ request }) => HttpResponse.json(await request.json())),
  http.post('/api/workflows/publish', async ({ request }) => HttpResponse.json(await request.json())),
];
