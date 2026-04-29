'use client';

import { useMemo, useState } from 'react';
import { useSearchModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { addSavedQuery, setFilters } from '../store/slice';
import type { SearchFilters } from '../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function SearchPage() {
  const dispatch = useAppDispatch();
  const { results, savedQueries, filters } = useSearchModule();
  const { local } = useParams<{ local: string }>();
  const [q, setQ] = useState('');
  const [secrecy, setSecrecy] = useState('');
  const [savedName, setSavedName] = useState('');

  const filtered = useMemo(
    () =>
      results.filter((r) => {
        const matchesQuery =
          r.title.toLowerCase().includes(q.toLowerCase()) ||
          r.refNo.toLowerCase().includes(q.toLowerCase());
        const matchesSecrecy = secrecy ? r.secrecy === secrecy : true;
        return matchesQuery && matchesSecrecy;
      }),
    [q, secrecy, results]
  );

  function applyFilters(next: SearchFilters) {
    dispatch(setFilters(next));
    setQ(next.query ?? '');
    setSecrecy(next.secrecy ?? '');
  }

  function saveCurrentQuery() {
    if (!savedName.trim()) return;
    dispatch(
      addSavedQuery({
        id: `sq-${Date.now()}`,
        name: savedName.trim(),
        filters: { query: q, secrecy: secrecy || undefined },
      })
    );
    setSavedName('');
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Search</h1><p className="text-sm text-muted-foreground">M4: Advanced search with saved query presets.</p></div>
      <div className="grid sm:grid-cols-3 gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by title or reference..." className="w-full h-10 rounded-md border px-3 sm:col-span-2" />
        <select value={secrecy} onChange={(e)=>setSecrecy(e.target.value)} className="w-full h-10 rounded-md border px-3">
          <option value="">All secrecy levels</option>
          <option value="public">public</option>
          <option value="restricted">restricted</option>
          <option value="confidential">confidential</option>
          <option value="top_secret">top_secret</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => applyFilters({ query: q, secrecy: secrecy || undefined })} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Apply filters</button>
        <button onClick={() => applyFilters({ query: '', secrecy: undefined })} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">Reset</button>
        <input value={savedName} onChange={(e)=>setSavedName(e.target.value)} placeholder="Saved query name" className="h-9 px-3 rounded-md border text-sm" />
        <button onClick={saveCurrentQuery} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm">Save query</button>
      </div>
      <p className="text-xs text-muted-foreground">Last applied filters: query="{filters.query}" secrecy="{filters.secrecy ?? 'all'}"</p>
      <div className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2 rounded-xl border bg-background overflow-x-auto">
          <table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">Reference</th><th className="p-3 text-start">Title</th><th className="p-3 text-start">Location</th></tr></thead><tbody>{filtered.map((r)=><tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.refNo}</td><td className="p-3">{r.title}</td><td className="p-3 font-mono text-xs">{r.locationCode}</td></tr>)}</tbody></table>
        </section>
        <section className="rounded-xl border bg-background p-4"><h2 className="font-semibold mb-2">Saved queries</h2><ul className="space-y-2 text-sm">{savedQueries.map((s)=><li key={s.id} className="border rounded-md p-2 flex items-center justify-between gap-2"><div className="flex flex-col"><span>{s.name}</span><Link href={`/${local}/search/saved/${s.id}`} className="text-xs text-primary hover:underline mt-1">Open saved query</Link></div><button onClick={() => applyFilters(s.filters)} className="text-xs h-7 px-2 rounded border hover:bg-muted">Apply</button></li>)}</ul></section>
      </div>
    </div>
  );
}
