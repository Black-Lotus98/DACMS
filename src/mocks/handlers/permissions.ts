import { http, HttpResponse } from 'msw';
import { usersSeed, rolesSeed, permissionsSeed, accessLogsSeed } from '@/features/m10-permissions/data';

export const permissionsHandlers = [
  http.get('/api/users', () => HttpResponse.json(usersSeed)),
  http.get('/api/roles', () => HttpResponse.json(rolesSeed)),
  http.get('/api/permissions', () => HttpResponse.json(permissionsSeed)),
  http.get('/api/access-log', () => HttpResponse.json(accessLogsSeed)),
];
