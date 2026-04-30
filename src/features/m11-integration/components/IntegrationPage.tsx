'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  addApiKey, toggleApiKey, revokeApiKey,
  addWebhook, toggleWebhook, deleteWebhook,
  toggleConnector,
  updateSmtpConfig, updateLdapConfig,
  setStatus,
} from '../store/slice';
import { useIntegrationModule } from '../hooks';
import {
  WebhookEventType, ConnectorStatus, SystemStatus,
  type APIKey, type WebhookConfig, type SmtpConfig, type LdapConfig,
} from '../types';

const EVENT_LABELS: Record<WebhookEventType, string> = {
  [WebhookEventType.RecordCreated]:       'Record Created',
  [WebhookEventType.RecordStatusChanged]: 'Record Status Changed',
  [WebhookEventType.LendingApproved]:     'Lending Approved',
  [WebhookEventType.LendingOverdue]:      'Lending Overdue',
  [WebhookEventType.DestructionExecuted]: 'Destruction Executed',
  [WebhookEventType.WorkflowCompleted]:   'Workflow Completed',
  [WebhookEventType.ApprovalCompleted]:   'Approval Completed',
};

const CONNECTOR_STATUS_COLOR: Record<ConnectorStatus, string> = {
  [ConnectorStatus.Active]:   'bg-green-100 text-green-800',
  [ConnectorStatus.Inactive]: 'bg-gray-100 text-gray-600',
  [ConnectorStatus.Error]:    'bg-red-100 text-red-800',
};

type Tab = 'apikeys' | 'webhooks' | 'connectors' | 'smtp' | 'ldap';

// ─── available permission scopes for API keys ─────────────────────────────────
const API_SCOPES = [
  'records.read', 'records.create', 'records.edit', 'records.delete',
  'search.basic', 'search.advanced',
  'lending.view', 'lending.create', 'lending.approve',
  'destruction.view', 'destruction.create', 'destruction.approve',
  'reports.view', 'reports.export',
  'workflow.view', 'workflow.manage',
];

export function IntegrationPage() {
  const dispatch = useAppDispatch();
  const { apiKeys, webhooks, connectors, smtpConfig, ldapConfig, status } = useIntegrationModule();

  const [tab, setTab] = useState<Tab>('apikeys');

  // API key form
  const [keyName, setKeyName]       = useState('');
  const [keyScopes, setKeyScopes]   = useState<string[]>([]);
  const [keyExpiry, setKeyExpiry]   = useState('');

  // Webhook form
  const [whName, setWhName]         = useState('');
  const [whUrl, setWhUrl]           = useState('');
  const [whEvent, setWhEvent]       = useState<WebhookEventType>(WebhookEventType.RecordCreated);
  const [whSecret, setWhSecret]     = useState('');

  // SMTP / LDAP local state
  const [smtp, setSmtp]             = useState<SmtpConfig>({ ...smtpConfig });
  const [ldap, setLdap]             = useState<LdapConfig>({ ...ldapConfig });
  const [smtpSaved, setSmtpSaved]   = useState(false);
  const [ldapSaved, setLdapSaved]   = useState(false);

  function handleAddApiKey() {
    if (!keyName.trim() || keyScopes.length === 0) return;
    const key: APIKey = {
      id:          `k-${Date.now()}`,
      name:        keyName.trim(),
      keyHash:     `sha256$${Math.random().toString(36).slice(2)}...`,
      permissions: keyScopes,
      isActive:    true,
      expiresAt:   keyExpiry || undefined,
      createdAt:   new Date().toISOString(),
    };
    dispatch(addApiKey(key));
    setKeyName(''); setKeyScopes([]); setKeyExpiry('');
  }

  function toggleScope(s: string) {
    setKeyScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleAddWebhook() {
    if (!whName.trim() || !whUrl.trim()) return;
    const wh: WebhookConfig = {
      id:        `w-${Date.now()}`,
      name:      whName.trim(),
      url:       whUrl.trim(),
      eventType: whEvent,
      secret:    whSecret.trim() || undefined,
      isActive:  true,
      createdAt: new Date().toISOString(),
    };
    dispatch(addWebhook(wh));
    setWhName(''); setWhUrl(''); setWhSecret('');
  }

  function handleSaveSmtp() {
    dispatch(updateSmtpConfig(smtp));
    setSmtpSaved(true); setTimeout(() => setSmtpSaved(false), 2000);
  }

  function handleSaveLdap() {
    dispatch(updateLdapConfig(ldap));
    setLdapSaved(true); setTimeout(() => setLdapSaved(false), 2000);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'apikeys',    label: `API Keys (${apiKeys.length})` },
    { key: 'webhooks',   label: `Webhooks (${webhooks.length})` },
    { key: 'connectors', label: `Connectors (${connectors.length})` },
    { key: 'smtp',       label: 'SMTP' },
    { key: 'ldap',       label: 'LDAP / AD' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Technical Integration</h1>
          <p className="text-sm text-muted-foreground">M11 · API keys, webhooks, connectors, SMTP, LDAP.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === SystemStatus.Connected ? 'bg-green-100 text-green-800' : status === SystemStatus.Degraded ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </span>
          <select
            value={status}
            onChange={(e) => dispatch(setStatus(e.target.value as SystemStatus))}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {Object.values(SystemStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? 'border-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── API Keys (F11.2) ── */}
      {tab === 'apikeys' && (
        <div className="space-y-5">
          {/* Add key form */}
          <section className="rounded-xl border bg-background p-4 space-y-4">
            <h2 className="font-semibold text-sm">Generate API Key · F11.2</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Integration name</label>
                <input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g. ERP System" className="w-full h-9 rounded-md border bg-background px-3 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Expiry date (optional)</label>
                <input type="date" value={keyExpiry} onChange={(e) => setKeyExpiry(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Permission scopes</label>
              <div className="flex flex-wrap gap-2">
                {API_SCOPES.map((s) => (
                  <label key={s} className="flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer hover:bg-muted">
                    <input type="checkbox" checked={keyScopes.includes(s)} onChange={() => toggleScope(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={handleAddApiKey} disabled={!keyName.trim() || keyScopes.length === 0} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-40">
              Generate key
            </button>
          </section>

          {/* Keys table */}
          <div className="rounded-xl border bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground text-xs">
                <th className="p-3">Name</th>
                <th className="p-3">Key Hash</th>
                <th className="p-3">Scopes</th>
                <th className="p-3">Expires</th>
                <th className="p-3">Last Used</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className={`border-b hover:bg-muted/40 ${!k.isActive ? 'opacity-50' : ''}`}>
                    <td className="p-3 font-medium">{k.name}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{k.keyHash}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {k.permissions.map((p) => <span key={p} className="text-xs bg-muted px-1.5 py-0.5 rounded">{p}</span>)}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{k.expiresAt ?? '—'}</td>
                    <td className="p-3 text-xs text-muted-foreground">{k.lastUsed ? k.lastUsed.slice(0, 10) : '—'}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {k.isActive ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-1">
                      <button onClick={() => dispatch(toggleApiKey(k.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted whitespace-nowrap">
                        {k.isActive ? 'Disable' : 'Enable'}
                      </button>
                      {k.isActive && (
                        <button onClick={() => dispatch(revokeApiKey(k.id))} className="text-xs h-7 px-2 rounded border hover:bg-destructive/10 text-destructive whitespace-nowrap">
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Webhooks (F11.3) ── */}
      {tab === 'webhooks' && (
        <div className="space-y-5">
          <section className="rounded-xl border bg-background p-4 space-y-4">
            <h2 className="font-semibold text-sm">Add Webhook · F11.3</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Name</label>
                <input value={whName} onChange={(e) => setWhName(e.target.value)} placeholder="My webhook" className="w-full h-9 rounded-md border bg-background px-3 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Endpoint URL</label>
                <input value={whUrl} onChange={(e) => setWhUrl(e.target.value)} placeholder="https://..." className="w-full h-9 rounded-md border bg-background px-3 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Event type</label>
                <select value={whEvent} onChange={(e) => setWhEvent(e.target.value as WebhookEventType)} className="w-full h-9 rounded-md border bg-background px-3 text-sm">
                  {Object.values(WebhookEventType).map((e) => <option key={e} value={e}>{EVENT_LABELS[e]}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">HMAC secret (optional)</label>
                <input value={whSecret} onChange={(e) => setWhSecret(e.target.value)} placeholder="whsec_..." className="w-full h-9 rounded-md border bg-background px-3 text-sm font-mono" />
              </div>
            </div>
            <button onClick={handleAddWebhook} disabled={!whName.trim() || !whUrl.trim()} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-40">
              Add webhook
            </button>
          </section>

          <div className="space-y-3">
            {webhooks.map((w) => (
              <div key={w.id} className={`rounded-xl border bg-background p-4 flex items-start justify-between gap-3 ${!w.isActive ? 'opacity-60' : ''}`}>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{w.name}</p>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{EVENT_LABELS[w.eventType]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${w.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {w.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground truncate">{w.url}</p>
                  {w.secret && <p className="text-xs text-muted-foreground">Secret: {w.secret.slice(0, 10)}…</p>}
                  {w.lastTriggeredAt && <p className="text-xs text-muted-foreground">Last triggered: {w.lastTriggeredAt.slice(0, 10)}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => dispatch(toggleWebhook(w.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted whitespace-nowrap">
                    {w.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => dispatch(deleteWebhook(w.id))} className="text-xs h-7 px-2 rounded border hover:bg-destructive/10 text-destructive whitespace-nowrap">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Connectors (F11.4 / F11.5) ── */}
      {tab === 'connectors' && (
        <div className="space-y-4">
          {connectors.map((c) => (
            <div key={c.id} className="rounded-xl border bg-background p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.endpoint}</p>
                  {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONNECTOR_STATUS_COLOR[c.status]}`}>
                    {c.status}
                  </span>
                  <button onClick={() => dispatch(toggleConnector(c.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted whitespace-nowrap">
                    {c.status === ConnectorStatus.Active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SMTP (F11.6) ── */}
      {tab === 'smtp' && (
        <section className="rounded-xl border bg-background p-6 space-y-5 max-w-xl">
          <h2 className="font-semibold">SMTP Configuration · F11.6</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {([
              ['host',        'SMTP Host',      'text'],
              ['port',        'Port',           'number'],
              ['username',    'Username',       'text'],
              ['fromAddress', 'From Address',   'email'],
              ['fromName',    'From Name',      'text'],
            ] as [keyof SmtpConfig, string, string][]).map(([field, label, type]) => (
              <div key={field} className="space-y-1">
                <label className="text-xs text-muted-foreground">{label}</label>
                <input
                  type={type}
                  value={smtp[field] as string | number}
                  onChange={(e) => setSmtp((s) => ({ ...s, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                />
              </div>
            ))}
            <div className="space-y-1 flex items-center gap-3 pt-5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={smtp.useTls} onChange={(e) => setSmtp((s) => ({ ...s, useTls: e.target.checked }))} className="w-4 h-4" />
                Require TLS (recommended)
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveSmtp} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">Save SMTP config</button>
            {smtpSaved && <span className="text-xs text-green-600">Saved.</span>}
          </div>
        </section>
      )}

      {/* ── LDAP (F11.7) ── */}
      {tab === 'ldap' && (
        <section className="rounded-xl border bg-background p-6 space-y-5 max-w-xl">
          <h2 className="font-semibold">LDAP / Active Directory · F11.7</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {([
              ['host',   'LDAP Host',  'text'],
              ['port',   'Port',       'number'],
              ['baseDn', 'Base DN',    'text'],
              ['bindDn', 'Bind DN',    'text'],
            ] as [keyof LdapConfig, string, string][]).map(([field, label, type]) => (
              <div key={field} className="space-y-1">
                <label className="text-xs text-muted-foreground">{label}</label>
                <input
                  type={type}
                  value={ldap[field] as string | number}
                  onChange={(e) => setLdap((l) => ({ ...l, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm font-mono"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={ldap.isEnabled} onChange={(e) => setLdap((l) => ({ ...l, isEnabled: e.target.checked }))} className="w-4 h-4" />
              Enable LDAP authentication
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={ldap.fallbackToLocal} onChange={(e) => setLdap((l) => ({ ...l, fallbackToLocal: e.target.checked }))} className="w-4 h-4" />
              Fall back to local accounts if LDAP unavailable
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveLdap} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">Save LDAP config</button>
            {ldapSaved && <span className="text-xs text-green-600">Saved.</span>}
          </div>
        </section>
      )}
    </div>
  );
}
