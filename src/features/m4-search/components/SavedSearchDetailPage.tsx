'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSearchModule } from '../hooks';

export function SavedSearchDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getSavedQueryById, results } = useSearchModule();
  const savedQuery = getSavedQueryById(id);

  const filteredResults = useMemo(() => {
    if (!savedQuery) return [];
    const query = (savedQuery.filters.query ?? '').toLowerCase();
    const secrecy = savedQuery.filters.secrecy;

    return results.filter((r) => {
      const matchesQuery =
        r.title.toLowerCase().includes(query) ||
        r.refNo.toLowerCase().includes(query);
      const matchesSecrecy = secrecy ? r.secrecy === secrecy : true;
      return matchesQuery && matchesSecrecy;
    });
  }, [savedQuery, results]);

  if (!savedQuery) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Saved query not found</h1>
        <p className="text-sm text-muted-foreground">This saved query id does not exist.</p>
        <Link href={`/${local}/search`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Saved query: {savedQuery.name}</h1>
          <p className="text-sm text-muted-foreground">Query: "{savedQuery.filters.query}" | Secrecy: {savedQuery.filters.secrecy ?? 'all'}</p>
        </div>
        <Link href={`/${local}/search`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to search
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start">Reference</th>
              <th className="p-3 text-start">Title</th>
              <th className="p-3 text-start">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr><td className="p-3 text-muted-foreground" colSpan={3}>No results for this saved query.</td></tr>
            ) : (
              filteredResults.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3 font-mono">{r.refNo}</td>
                  <td className="p-3">{r.title}</td>
                  <td className="p-3 font-mono text-xs">{r.locationCode}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
