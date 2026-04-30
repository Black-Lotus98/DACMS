'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSearchModule } from '../hooks';

export function SavedSearchDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getSavedQueryById, allResults, getLocationPath } = useSearchModule();

  const savedQuery = getSavedQueryById(id);

  if (!savedQuery) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Saved query not found</h1>
        <p className="text-sm text-muted-foreground">This saved query does not exist.</p>
        <Link href={`/${local}/search`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to search
        </Link>
      </div>
    );
  }

  const f = savedQuery.filters;
  const filteredResults = allResults.filter((r) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      if (
        !r.titleEn.toLowerCase().includes(q) &&
        !r.titleAr.includes(f.query) &&
        !r.refNo.toLowerCase().includes(q)
      ) return false;
    }
    if (f.docTypeId  && r.docTypeId  !== f.docTypeId)  return false;
    if (f.categoryId && r.categoryId !== f.categoryId) return false;
    if (f.status     && r.status     !== f.status)     return false;
    if (f.secrecy    && r.secrecy    !== f.secrecy)    return false;
    if (f.dateFrom   && r.archiveDate < f.dateFrom)    return false;
    if (f.dateTo     && r.archiveDate > f.dateTo)      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{savedQuery.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Saved {savedQuery.createdAt.slice(0, 10)} · {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </p>
          {f.query && <p className="text-sm mt-1">Query: &quot;{f.query}&quot;</p>}
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
            {f.docTypeId  && <span>Type: {f.docTypeId}</span>}
            {f.categoryId && <span>Category: {f.categoryId}</span>}
            {f.status     && <span>Status: {f.status}</span>}
            {f.secrecy    && <span>Secrecy: {f.secrecy}</span>}
            {f.dateFrom   && <span>From: {f.dateFrom}</span>}
            {f.dateTo     && <span>To: {f.dateTo}</span>}
          </div>
        </div>
        <Link href={`/${local}/search`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted shrink-0">
          Back to search
        </Link>
      </div>

      <section className="rounded-xl border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-start font-medium">Reference</th>
              <th className="p-3 text-start font-medium">Title (EN)</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-start font-medium">Secrecy</th>
              <th className="p-3 text-start font-medium">Location</th>
              <th className="p-3 text-start font-medium">Archive date</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-muted-foreground">
                  No results for this saved query.
                </td>
              </tr>
            ) : (
              filteredResults.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{r.refNo}</td>
                  <td className="p-3">{r.titleEn}</td>
                  <td className="p-3 text-xs">{r.status}</td>
                  <td className="p-3 text-xs">{r.secrecy}</td>
                  <td className="p-3 font-mono text-xs">{getLocationPath(r.boxId)}</td>
                  <td className="p-3 text-muted-foreground text-xs">{r.archiveDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
