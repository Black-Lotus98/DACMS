'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useIntegrationModule } from '../hooks';
import { addApiKey, addWebhook, setStatus, toggleApiKey, toggleWebhook } from '../store/slice';

export function IntegrationPage() {
  const dispatch = useAppDispatch();
  const { apiKeys, webhooks, status } = useIntegrationModule();

  const [keyName, setKeyName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState('');

  function createApiKey() {
    if (!keyName.trim()) return;
    dispatch(
      addApiKey({
        id: `k-${Date.now()}`,
        name: keyName.trim(),
        lastUsed: new Date().toISOString().slice(0, 10),
        active: true,
      })
    );
    setKeyName('');
  }

  function createWebhook() {
    if (!webhookUrl.trim() || !webhookEvent.trim()) return;
    dispatch(
      addWebhook({
        id: `w-${Date.now()}`,
        url: webhookUrl.trim(),
        event: webhookEvent.trim(),
        active: true,
      })
    );
    setWebhookUrl('');
    setWebhookEvent('');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Integration</h1>
        <select
          value={status}
          onChange={(e) => dispatch(setStatus(e.target.value as 'connected' | 'degraded' | 'disconnected'))}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="connected">connected</option>
          <option value="degraded">degraded</option>
          <option value="disconnected">disconnected</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <section className="rounded-lg border p-3 space-y-3">
          <h2 className="font-semibold">API Keys</h2>
          <div className="flex gap-2">
            <input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="اسم المفتاح" className="h-9 rounded-md border px-3 text-sm flex-1" />
            <button onClick={createApiKey} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
          </div>
          {apiKeys.map((k) => (
            <div key={k.id} className="text-sm border rounded p-2 flex items-center justify-between gap-2">
              <div>
                <p>{k.name}</p>
                <p className="text-xs text-muted-foreground">last: {k.lastUsed ?? '—'}</p>
              </div>
              <button onClick={() => dispatch(toggleApiKey(k.id))} className="h-7 px-2 rounded border text-xs hover:bg-muted">
                {k.active ? 'active' : 'inactive'}
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-lg border p-3 space-y-3">
          <h2 className="font-semibold">Webhooks</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            <input value={webhookEvent} onChange={(e) => setWebhookEvent(e.target.value)} placeholder="event key" className="h-9 rounded-md border px-3 text-sm" />
            <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://..." className="h-9 rounded-md border px-3 text-sm" />
          </div>
          <button onClick={createWebhook} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة webhook</button>
          {webhooks.map((w) => (
            <div key={w.id} className="text-sm border rounded p-2 flex items-center justify-between gap-2">
              <div>
                <p>{w.event}</p>
                <p className="text-xs text-muted-foreground font-mono">{w.url}</p>
              </div>
              <button onClick={() => dispatch(toggleWebhook(w.id))} className="h-7 px-2 rounded border text-xs hover:bg-muted">
                {w.active ? 'active' : 'inactive'}
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
