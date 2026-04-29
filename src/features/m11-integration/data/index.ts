import type { APIKey, WebhookConfig } from '../types';
export const apiKeysSeed: APIKey[] = [
  { id: 'k1', name: 'ERP Integration', lastUsed: '2026-04-29', active: true },
  { id: 'k2', name: 'Reporting Client', lastUsed: '2026-04-27', active: true },
];
export const webhooksSeed: WebhookConfig[] = [
  { id: 'w1', url: 'https://example.com/hooks/archive', event: 'record.archived', active: true },
  { id: 'w2', url: 'https://example.com/hooks/lending', event: 'lending.overdue', active: false },
];
