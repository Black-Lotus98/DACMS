'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addRecord } from '../store/slice';
import { RecordStatus, SecrecyLevel } from '../types';

const TEMPLATE_HEADERS = ['refNo', 'titleAr', 'titleEn', 'docTypeId', 'categoryId', 'boxId', 'shelfId', 'secrecy', 'issueDate', 'archiveDate', 'retentionEnd'];

type ImportRow = {
  row: number;
  refNo: string;
  titleAr: string;
  titleEn: string;
  docTypeId: string;
  categoryId: string;
  boxId: string;
  shelfId: string;
  secrecy: string;
  issueDate: string;
  archiveDate: string;
  retentionEnd: string;
  error?: string;
};

function parseCSV(text: string): string[][] {
  return text.trim().split('\n').map((line) =>
    line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
  );
}

function validateRow(r: ImportRow, existingRefs: Set<string>): string | undefined {
  if (!r.refNo)       return 'refNo is required';
  if (!r.titleEn)     return 'titleEn is required';
  if (!r.docTypeId)   return 'docTypeId is required';
  if (!r.boxId)       return 'boxId is required';
  if (!r.issueDate)   return 'issueDate is required';
  if (!r.archiveDate) return 'archiveDate is required';
  if (!r.retentionEnd) return 'retentionEnd is required';
  if (existingRefs.has(r.refNo)) return `Duplicate refNo: ${r.refNo}`;
  const validSecrecy = Object.values(SecrecyLevel) as string[];
  if (r.secrecy && !validSecrecy.includes(r.secrecy)) return `Invalid secrecy value: ${r.secrecy}`;
  return undefined;
}

export function RecordImportPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const existingRecords = useAppSelector((s) => s.records.items);

  const [rows,     setRows]     = useState<ImportRow[]>([]);
  const [imported, setImported] = useState(false);
  const [fileError, setFileError] = useState('');

  function downloadTemplate() {
    const csv = [TEMPLATE_HEADERS.join(','), 'REC-2026-XXXXX,العنوان بالعربي,Title EN,dt1,c1,bx1,sh1,PUBLIC,2026-01-01,2026-02-01,2031-01-01'].join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download = 'records-import-template.csv';
    a.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(''); setImported(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = parseCSV(text);
      if (lines.length < 2) { setFileError('CSV must have at least one data row.'); return; }

      const headers = lines[0];
      const required = ['refNo', 'titleEn', 'docTypeId', 'boxId', 'issueDate', 'archiveDate', 'retentionEnd'];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length) { setFileError(`Missing columns: ${missing.join(', ')}`); return; }

      const existingRefs = new Set(existingRecords.map((r) => r.refNo));
      const parsed: ImportRow[] = lines.slice(1).map((cols, i) => {
        const get = (key: string) => cols[headers.indexOf(key)] ?? '';
        const row: ImportRow = {
          row: i + 2,
          refNo: get('refNo'), titleAr: get('titleAr'), titleEn: get('titleEn'),
          docTypeId: get('docTypeId'), categoryId: get('categoryId'),
          boxId: get('boxId'), shelfId: get('shelfId'),
          secrecy: get('secrecy'), issueDate: get('issueDate'),
          archiveDate: get('archiveDate'), retentionEnd: get('retentionEnd'),
        };
        row.error = validateRow(row, existingRefs);
        if (!row.error) existingRefs.add(row.refNo);
        return row;
      });
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  function importValid() {
    const valid = rows.filter((r) => !r.error);
    valid.forEach((r) => {
      dispatch(addRecord({
        id: `rec-import-${Date.now()}-${r.row}`,
        refNo: r.refNo,
        titleAr: r.titleAr || r.titleEn,
        titleEn: r.titleEn,
        docTypeId: r.docTypeId,
        categoryId: r.categoryId || '',
        boxId: r.boxId,
        shelfId: r.shelfId || '',
        status: RecordStatus.Active,
        secrecy: (r.secrecy as SecrecyLevel) || SecrecyLevel.Internal,
        issueDate: r.issueDate,
        archiveDate: r.archiveDate,
        retentionEnd: r.retentionEnd,
        metadata: {},
        createdBy: 'import',
      }));
    });
    setImported(true);
  }

  const validCount   = rows.filter((r) => !r.error).length;
  const invalidCount = rows.filter((r) =>  r.error).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Import records (F3.4)</h1>
          <p className="text-sm text-muted-foreground">Bulk-import records from a CSV file.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={downloadTemplate} className="inline-flex h-9 items-center gap-1.5 px-3 rounded-md border text-sm hover:bg-muted">
            <Download className="w-4 h-4" />
            Template
          </button>
          <Link href={`/${local}/records`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            Back
          </Link>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Upload CSV</h2>
        <p className="text-xs text-muted-foreground">Required columns: refNo, titleEn, docTypeId, boxId, issueDate, archiveDate, retentionEnd</p>
        <label className="flex items-center gap-3 h-9 px-3 rounded-md border text-sm cursor-pointer hover:bg-muted w-fit">
          <Upload className="w-4 h-4" />
          Choose file
          <input type="file" accept=".csv" onChange={onFileChange} className="hidden" />
        </label>
        {fileError && <p className="text-sm text-red-600">{fileError}</p>}
      </section>

      {rows.length > 0 && (
        <section className="rounded-xl border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between gap-3">
            <div className="flex gap-4 text-sm">
              <span className="text-green-600 font-medium">{validCount} valid</span>
              {invalidCount > 0 && <span className="text-red-600 font-medium">{invalidCount} errors</span>}
            </div>
            {!imported && validCount > 0 && (
              <button
                onClick={importValid}
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm"
              >
                Import {validCount} records
              </button>
            )}
            {imported && (
              <span className="text-sm text-green-600 font-medium">Imported successfully</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="text-start p-2 font-medium w-10">#</th>
                  <th className="text-start p-2 font-medium">refNo</th>
                  <th className="text-start p-2 font-medium">titleEn</th>
                  <th className="text-start p-2 font-medium">docTypeId</th>
                  <th className="text-start p-2 font-medium">boxId</th>
                  <th className="text-start p-2 font-medium">secrecy</th>
                  <th className="text-start p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.row} className={`border-b last:border-b-0 ${r.error ? 'bg-red-50' : ''}`}>
                    <td className="p-2 text-muted-foreground">{r.row}</td>
                    <td className="p-2 font-mono">{r.refNo}</td>
                    <td className="p-2">{r.titleEn}</td>
                    <td className="p-2 font-mono">{r.docTypeId}</td>
                    <td className="p-2 font-mono">{r.boxId}</td>
                    <td className="p-2">{r.secrecy}</td>
                    <td className="p-2">
                      {r.error
                        ? <span className="flex items-center gap-1 text-red-600"><XCircle className="w-3 h-3" />{r.error}</span>
                        : <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" />OK</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
