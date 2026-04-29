import { http, HttpResponse } from 'msw';
import { RoleType, ROLE_CLEARANCE } from '@/config/roles';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { role: RoleType };
    const role = body.role ?? RoleType.Beneficiary;
    return HttpResponse.json({
      user: {
        id: `mock-${role}`,
        name: 'Mock User',
        email: `${role}@dacms.gov`,
        role,
        clearanceLevel: ROLE_CLEARANCE[role],
      },
      role,
      clearanceLevel: ROLE_CLEARANCE[role],
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];
