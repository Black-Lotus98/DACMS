import { http, HttpResponse } from 'msw';
import { notificationsSeed, notificationPreferencesSeed } from '@/features/m8-notifications/data';

export const notificationsHandlers = [
  http.get('/api/notifications', () => HttpResponse.json(notificationsSeed)),
  http.get('/api/notifications/preferences', () => HttpResponse.json(notificationPreferencesSeed)),
  http.post('/api/notifications', async ({ request }) => HttpResponse.json(await request.json())),
];
