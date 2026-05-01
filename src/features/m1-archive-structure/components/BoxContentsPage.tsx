'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useRecordsModule } from '@/features/m3-records/hooks';
import { useArchiveModule } from '../hooks';

const SECRECY_COLOR: Record<string, string> = {
  PUBLIC:     'bg-green-100 text-green-700',
  INTERNAL:   'bg-blue-100 text-blue-700',
  SECRET:     'bg-amber-100 text-amber-700',
  TOP_SECRET: 'bg-red-100 text-red-700',
};

export function BoxContentsPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { boxes, shelves, cabinets, rows, rooms } = useArchiveModule();
  const { getRecordsByBox } = useRecordsModule();

  const box = boxes.find((b) => b.id === id);
  const shelf   = box   ? shelves.find((s) => s.id === box.shelfId)        : undefined;
  const cabinet = shelf ? cabinets.find((c) => c.id === shelf.cabinetId)   : undefined;
  const row     = cabinet ? rows.find((r) => r.id === cabinet.rowId)       : undefined;
  const room    = row   ? rooms.find((r) => r.id === row.roomId)           : undefined;

  const records = box ? getRecordsByBox(box.id) : [];

  if (!box) {
    return (
      <div className="space-y-3">
        <p className="text-sm">Box not found.</p>
        <Link href={`/${local}/archive-structure`} className="text-primary hover:underline text-sm">
          Back to archive structure
        </Link>
      </div>
    );
  }

  const breadcrumb = [room?.nameEn, row?.code, cabinet?.code, shelf?.code, box.code]
    .filter(Boolean)
    .join(' › ');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Box contents (F3.5)</h1>
          <p className="text-sm text-muted-foreground font-mono">{breadcrumb}</p>
        </div>
        <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted shrink-0">
          Back
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <h2 className="font-semibold">Box details</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Code</p>
            <p className="font-mono font-medium">{box.code}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Label</p>
            <p>{box.label}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Status</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${box.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {box.isActive ? 'Active' : 'Inactive'}
              </span>
              {box.isSealed && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Sealed</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Records ({records.length})</h2>
        </div>
        {records.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No accessible records in this box.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="p-3 text-start font-medium">Reference</th>
                <th className="p-3 text-start font-medium">Title</th>
                <th className="p-3 text-start font-medium">Status</th>
                <th className="p-3 text-start font-medium">Secrecy</th>
                <th className="p-3 text-start font-medium">Archive date</th>
                <th className="p-3 text-start font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{rec.refNo}</td>
                  <td className="p-3">{rec.titleEn}</td>
                  <td className="p-3 text-xs">{rec.status}</td>
                  <td className="p-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${SECRECY_COLOR[rec.secrecy] ?? ''}`}>
                      {rec.secrecy}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{rec.archiveDate}</td>
                  <td className="p-3">
                    <Link href={`/${local}/records/${rec.id}`} className="text-primary hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
