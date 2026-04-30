import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiKeysSeed, connectorsSeed, defaultLdapConfig, defaultSmtpConfig, defaultSystemStatus, webhooksSeed } from '../data';
import { ConnectorStatus } from '../types';
import type { APIKey, IntegrationConnector, IntegrationState, LdapConfig, SmtpConfig, SystemStatus, WebhookConfig } from '../types';

const initialState: IntegrationState = {
  apiKeys:    apiKeysSeed,
  webhooks:   webhooksSeed,
  connectors: connectorsSeed,
  smtpConfig: defaultSmtpConfig,
  ldapConfig: defaultLdapConfig,
  status:     defaultSystemStatus,
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    // ── API keys (F11.2) ───────────────────────────────────────────────────
    addApiKey(state, action: PayloadAction<APIKey>) {
      state.apiKeys.unshift(action.payload);
    },
    toggleApiKey(state, action: PayloadAction<string>) {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key) key.isActive = !key.isActive;
    },
    revokeApiKey(state, action: PayloadAction<string>) {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key) { key.isActive = false; key.expiresAt = new Date().toISOString().slice(0, 10); }
    },
    updateApiKeyPermissions(state, action: PayloadAction<{ id: string; permissions: string[] }>) {
      const key = state.apiKeys.find((k) => k.id === action.payload.id);
      if (key) key.permissions = action.payload.permissions;
    },

    // ── webhooks (F11.3) ───────────────────────────────────────────────────
    addWebhook(state, action: PayloadAction<WebhookConfig>) {
      state.webhooks.unshift(action.payload);
    },
    toggleWebhook(state, action: PayloadAction<string>) {
      const wh = state.webhooks.find((w) => w.id === action.payload);
      if (wh) wh.isActive = !wh.isActive;
    },
    deleteWebhook(state, action: PayloadAction<string>) {
      state.webhooks = state.webhooks.filter((w) => w.id !== action.payload);
    },

    // ── connectors (F11.4 / F11.5) ────────────────────────────────────────
    addConnector(state, action: PayloadAction<IntegrationConnector>) {
      state.connectors.push(action.payload);
    },
    toggleConnector(state, action: PayloadAction<string>) {
      const con = state.connectors.find((c) => c.id === action.payload);
      if (!con) return;
      con.status = con.status === ConnectorStatus.Active ? ConnectorStatus.Inactive : ConnectorStatus.Active;
    },

    // ── SMTP (F11.6) ───────────────────────────────────────────────────────
    updateSmtpConfig(state, action: PayloadAction<SmtpConfig>) {
      state.smtpConfig = action.payload;
    },

    // ── LDAP (F11.7) ───────────────────────────────────────────────────────
    updateLdapConfig(state, action: PayloadAction<LdapConfig>) {
      state.ldapConfig = action.payload;
    },

    // ── system status ──────────────────────────────────────────────────────
    setStatus(state, action: PayloadAction<SystemStatus>) {
      state.status = action.payload;
    },
  },
});

export const {
  addApiKey, toggleApiKey, revokeApiKey, updateApiKeyPermissions,
  addWebhook, toggleWebhook, deleteWebhook,
  addConnector, toggleConnector,
  updateSmtpConfig,
  updateLdapConfig,
  setStatus,
} = integrationSlice.actions;

export default integrationSlice.reducer;
