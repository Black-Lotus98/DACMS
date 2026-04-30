import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ConnectorType, WebhookEventType } from '../types';

export function useIntegrationModule() {
  const state = useAppSelector((s) => s.integration);

  return useMemo(() => ({
    apiKeys:    state.apiKeys,
    webhooks:   state.webhooks,
    connectors: state.connectors,
    smtpConfig: state.smtpConfig,
    ldapConfig: state.ldapConfig,
    status:     state.status,

    activeApiKeys:   state.apiKeys.filter((k) => k.isActive),
    inactiveApiKeys: state.apiKeys.filter((k) => !k.isActive),

    activeWebhooks: state.webhooks.filter((w) => w.isActive),

    getApiKeyById:      (id: string) => state.apiKeys.find((k) => k.id === id) ?? null,
    getWebhooksByEvent: (event: WebhookEventType) => state.webhooks.filter((w) => w.eventType === event),
    getConnectorByType: (type: ConnectorType) => state.connectors.find((c) => c.type === type) ?? null,
  }), [state]);
}
