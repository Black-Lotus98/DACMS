'use client';

import { useState } from 'react';
import { useSearchModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { addSavedQuery, deleteSavedQuery, setBarcodeQuery, setFilters } from '../store/slice';
import { RecordStatus, SecrecyLevel } from '@/features/m3-records/types';
import type { SearchFilters } from '../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Tab = 'advanced' | 'barcode';

const INPUT  = 'w-full h-9 rounded-md border px-3 text-sm';
const BTN    = 'h-9 px-3 rounded-md border text-sm hover:bg-muted';

export function SearchPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { results, savedQueries, filters, barcodeQuery, getLocationPath, searchByBarcode } = useSearchModule();

  const [tab,        setTab]        = useState<Tab>('advanced');
  const [query,      setQuery]      = useState(filters.query);
  const [docTypeId,  setDocTypeId]  = useState(filters.docTypeId ?? '');
  const [categoryId, setCategoryId] = useState(filters.categoryId ?? '');
  const [status,     setStatus]     = useState<RecordStatus | ''>(filters.status ?? '');
  const [secrecy,    setSecrecy]    = useState<SecrecyLevel | ''>(filters.secrecy ?? '');
  const [dateFrom,   setDateFrom]   = useState(filters.dateFrom ?? '');
  const [dateTo,     setDateTo]     = useState(filters.dateTo ?? '');
  const [department, setDepartment] = useState(filters.department ?? '');
  const [savedName,  setSavedName]  = useState('');
  const [barcode,    setBarcode]    = useState(barcodeQuery);

  function buildFilters(): SearchFilters {
    return {
      query,
      docTypeId:   docTypeId   || undefined,
      categoryId:  categoryId  || undefined,
      status:      status      || undefined,
      secrecy:     secrecy     || undefined,
      dateFrom:    dateFrom    || undefined,
      dateTo:      dateTo      || undefined,
      department:  department  || undefined,
    };
  }

  function applyFilters() {
    dispatch(setFilters(buildFilters()));
  }

  function resetFilters() {
    setQuery(''); setDocTypeId(''); setCategoryId('');
    setStatus(''); setSecrecy(''); setDateFrom(''); setDateTo(''); setDepartment('');
    dispatch(setFilters({ query: '' }));
  }

  function loadSavedQuery(f: SearchFilters) {
    setQuery(f.query ?? '');
    setDocTypeId(f.docTypeId ?? '');
    setCategoryId(f.categoryId ?? '');
    setStatus(f.status ?? '');
    setSecrecy(f.secrecy ?? '');
    setDateFrom(f.dateFrom ?? '');
    setDateTo(f.dateTo ?? '');
    setDepartment(f.department ?? '');
    dispatch(setFilters(f));
  }

  function saveCurrentQuery() {
    if (!savedName.trim()) return;
    dispatch(addSavedQuery({
      id:        `sq-${Date.now()}`,
      name:      savedName.trim(),
      userId:    'current-user',
      filters:   buildFilters(),
      createdAt: new Date().toISOString(),
    }));
    setSavedName('');
  }

  function handleBarcodeSearch() {
    dispatch(setBarcodeQuery(barcode));
  }

  const barcodeResult = barcode ? searchByBarcode(barcode) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search & Retrieval</h1>
        <p className="text-sm text-muted-foreground">Advanced record search, saved queries, and barcode lookup.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        {(['advanced', 'barcode'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${tab === t ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'advanced' ? 'Advanced search' : 'Barcode scan'}
          </button>
        ))}
      </div>

      {tab === 'advanced' && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Filters panel */}
          <div className="md:col-span-2 space-y-4">
            <section className="rounded-xl border bg-background p-4 space-y-3">
              <h2 className="font-semibold text-sm">Filters</h2>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, reference, or metadata…"
                className={INPUT}
              />

              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  value={docTypeId}
                  onChange={(e) => setDocTypeId(e.target.value)}
                  placeholder="Document type ID"
                  className={INPUT}
                />
                <input
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Category ID"
                  className={INPUT}
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RecordStatus | '')}
                  className={INPUT}
                >
                  <option value="">All statuses</option>
                  {Object.values(RecordStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={secrecy}
                  onChange={(e) => setSecrecy(e.target.value as SecrecyLevel | '')}
                  className={INPUT}
                >
                  <option value="">All secrecy levels</option>
                  {Object.values(SecrecyLevel).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="Archive date from"
                  className={INPUT}
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="Archive date to"
                  className={INPUT}
                />
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                  className={INPUT}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={applyFilters} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm">
                  Search
                </button>
                <button onClick={resetFilters} className={BTN}>Reset</button>
                <input
                  value={savedName}
                  onChange={(e) => setSavedName(e.target.value)}
                  placeholder="Save this query as…"
                  className="h-9 px-3 rounded-md border text-sm flex-1 min-w-32"
                />
                <button onClick={saveCurrentQuery} className={BTN}>Save query</button>
              </div>
            </section>

            {/* Results table */}
            <section className="rounded-xl border bg-background overflow-x-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-medium">{results.length} result{results.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={() => alert('Export: PDF/Excel export not yet implemented.')}
                  className={BTN}
                >
                  Export
                </button>
              </div>
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
                  {results.length === 0 ? (
                    <tr><td colSpan={6} className="p-4 text-sm text-muted-foreground">No records found. Try broadening your filters.</td></tr>
                  ) : (
                    results.map((r) => (
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

          {/* Saved queries sidebar */}
          <section className="rounded-xl border bg-background p-4 space-y-2 h-fit">
            <h2 className="font-semibold text-sm">Saved queries</h2>
            {savedQueries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved queries yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {savedQueries.map((sq) => (
                  <li key={sq.id} className="border rounded-md p-2 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{sq.name}</span>
                      <button
                        onClick={() => dispatch(deleteSavedQuery(sq.id))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{sq.createdAt.slice(0, 10)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadSavedQuery(sq.filters)}
                        className="text-xs h-7 px-2 rounded border hover:bg-muted"
                      >
                        Apply
                      </button>
                      <Link
                        href={`/${local}/search/saved/${sq.id}`}
                        className="text-xs text-primary hover:underline flex items-center"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === 'barcode' && (
        <div className="max-w-lg space-y-4">
          <section className="rounded-xl border bg-background p-4 space-y-3">
            <h2 className="font-semibold text-sm">Barcode scan lookup</h2>
            <p className="text-xs text-muted-foreground">Enter or scan a barcode to instantly retrieve the associated record.</p>
            <div className="flex gap-2">
              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                placeholder="Scan or type barcode / reference number…"
                className={`${INPUT} flex-1`}
                autoFocus
              />
              <button onClick={handleBarcodeSearch} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm">
                Search
              </button>
            </div>
          </section>

          {barcode && (
            <section className="rounded-xl border bg-background p-4">
              {barcodeResult ? (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">{barcodeResult.titleEn}</p>
                  <p dir="rtl" className="text-muted-foreground">{barcodeResult.titleAr}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground pt-1">
                    <span>Reference: <span className="font-mono text-foreground">{barcodeResult.refNo}</span></span>
                    <span>Status: {barcodeResult.status}</span>
                    <span>Secrecy: {barcodeResult.secrecy}</span>
                    <span>Archive date: {barcodeResult.archiveDate}</span>
                    <span className="col-span-2">Location: <span className="font-mono">{getLocationPath(barcodeResult.boxId)}</span></span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unrecognized barcode: no record matches "{barcode}".</p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
