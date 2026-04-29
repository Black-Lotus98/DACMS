'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useIntegrationModule } from '../hooks';
import { toggleApiKey } from '../store/slice';

export function IntegrationApiKeysPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { apiKeys } = useIntegrationModule();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">API keys</h1>
          <p className="text-sm text-muted-foreground">Manage activation state for integration API keys.</p>
        </div>
        <Link href={`/${local}/integration`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to integration
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2">
        {apiKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys configured yet.</p>
        ) : (
          apiKeys.map((k) => (
            <div key={k.id} className="text-sm border rounded p-2 flex items-center justify-between gap-2">
              <div>
                <p>{k.name}</p>
                <p className="text-xs text-muted-foreground">last: {k.lastUsed ?? '—'}</p>
              </div>
              <button onClick={() => dispatch(toggleApiKey(k.id))} className="h-8 px-3 rounded border text-xs hover:bg-muted">
                {k.active ? 'active' : 'inactive'}
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
