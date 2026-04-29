import { http, HttpResponse } from 'msw';
import { barcodeLabelsSeed, printJobsSeed } from '@/features/m5-barcodes/data';

export const barcodesHandlers = [
  http.get('/api/barcodes', () => HttpResponse.json(barcodeLabelsSeed)),
  http.get('/api/barcodes/print-jobs', () => HttpResponse.json(printJobsSeed)),
  http.post('/api/barcodes/generate', async ({ request }) => HttpResponse.json(await request.json())),
  http.post('/api/barcodes/batch-print', async ({ request }) => HttpResponse.json(await request.json())),
];
