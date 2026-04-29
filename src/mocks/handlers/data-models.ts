import { http, HttpResponse } from 'msw';
import {
  documentTypesSeed,
  categoriesSeed,
  metadataFieldsSeed,
  retentionPoliciesSeed,
} from '@/features/m2-data-models/data';

export const dataModelsHandlers = [
  http.get('/api/doc-types', () => HttpResponse.json(documentTypesSeed)),
  http.get('/api/categories', () => HttpResponse.json(categoriesSeed)),
  http.get('/api/metadata-fields', () => HttpResponse.json(metadataFieldsSeed)),
  http.get('/api/retention-policies', () => HttpResponse.json(retentionPoliciesSeed)),
];
