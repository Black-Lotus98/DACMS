import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiKeysSeed, webhooksSeed } from '../data';
import type { APIKey, IntegrationState, WebhookConfig } from '../types';

const initialState: IntegrationState = { apiKeys: apiKeysSeed, webhooks: webhooksSeed, status: 'connected' };

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    addApiKey(state, action: PayloadAction<APIKey>) { state.apiKeys.unshift(action.payload); },
    addWebhook(state, action: PayloadAction<WebhookConfig>) { state.webhooks.unshift(action.payload); },
    setStatus(state, action: PayloadAction<IntegrationState['status']>) { state.status = action.payload; },
    toggleApiKey(state, action: PayloadAction<string>) {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key) key.active = !key.active;
    },
    toggleWebhook(state, action: PayloadAction<string>) {
      const webhook = state.webhooks.find((w) => w.id === action.payload);
      if (webhook) webhook.active = !webhook.active;
    },
  },
});

export const { addApiKey, addWebhook, setStatus, toggleApiKey, toggleWebhook } = integrationSlice.actions;
export default integrationSlice.reducer;
