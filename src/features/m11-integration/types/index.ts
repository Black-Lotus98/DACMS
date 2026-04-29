export interface APIKey { id: string; name: string; lastUsed?: string; active: boolean }
export interface WebhookConfig { id: string; url: string; event: string; active: boolean }
export interface IntegrationState { apiKeys: APIKey[]; webhooks: WebhookConfig[]; status: 'connected'|'degraded'|'disconnected' }
