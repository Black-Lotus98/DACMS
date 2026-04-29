import { http, HttpResponse } from 'msw';
import { branchesSeed, departmentsSeed, orgSeed } from '@/features/m13-org-structure/data';

export const orgHandlers = [
  http.get('/api/org', () => HttpResponse.json(orgSeed)),
  http.get('/api/branches', () => HttpResponse.json(branchesSeed)),
  http.get('/api/departments', () => HttpResponse.json(departmentsSeed)),
  http.get('/api/org-tree', () =>
    HttpResponse.json({
      organization: orgSeed,
      branches: branchesSeed.map((b) => ({
        ...b,
        departments: departmentsSeed.filter((d) => d.branchId === b.id),
      })),
    })
  ),
];
