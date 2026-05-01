'use client';

import { useState } from 'react';
import { useBarcodesModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { addPrintJob, cyclePrintJobStatus, replaceBarcode } from '../store/slice';
import { BarcodePreview } from './BarcodePreview';
import { BarcodeType, EntityType, PrintStatus } from '../types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const STATUS_COLOR: Record<PrintStatus, string> = {
  [PrintStatus.Queued]:   'bg-amber-100 text-amber-700',
  [PrintStatus.Printing]: 'bg-blue-100 text-blue-700',
  [PrintStatus.Done]:     'bg-green-100 text-green-700',
};

export function BarcodesPage() {
  const dispatch = useAppDispatch();
  const { labels, printJobs, getLabelsByEntityType } = useBarcodesModule();
  const { local } = useParams<{ local: string }>();

  const [selectedLabelId, setSelectedLabelId] = useState(labels[0]?.id ?? '');
  const [filterType,      setFilterType]      = useState<EntityType | ''>('');

  const selectedLabel = labels.find((l) => l.id === selectedLabelId) ?? labels[0];
  const visibleLabels = filterType
    ? getLabelsByEntityType(filterType)
    : labels;

  function handleReplace(labelId: string) {
    const old = labels.find((l) => l.id === labelId);
    if (!old) return;
    const newLabel = {
      id:          `bl-${Date.now()}`,
      entityType:  old.entityType,
      entityId:    old.entityId,
      barcodeVal:  `${old.barcodeVal}-R${Date.now().toString().slice(-4)}`,
      type:        old.type,
      generatedAt: new Date().toISOString(),
      isActive:    true,
    };
    dispatch(replaceBarcode({ oldLabelId: labelId, newLabel }));
    setSelectedLabelId(newLabel.id);
  }

  function createBatchJob() {
    const activeIds = visibleLabels.filter((l) => l.isActive).map((l) => l.id);
    if (activeIds.length === 0) return;
    dispatch(addPrintJob({
      id:          `pj-${Date.now()}`,
      createdBy:   'current-user',
      labelIds:    activeIds,
      status:      PrintStatus.Queued,
      printFormat: 'A4-3x8',
      queuedAt:    new Date().toISOString(),
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Barcodes & Labels</h1>
        <p className="text-sm text-muted-foreground">Label generation, batch printing, and barcode replacement.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Labels table */}
        <section className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EntityType | '')}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value="">All entity types</option>
              {Object.values(EntityType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={createBatchJob}
              className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Batch print visible
            </button>
          </div>

          <div className="rounded-xl border bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="p-3 text-start font-medium">Type</th>
                  <th className="p-3 text-start font-medium">Entity ID</th>
                  <th className="p-3 text-start font-medium">Barcode value</th>
                  <th className="p-3 text-start font-medium">Format</th>
                  <th className="p-3 text-start font-medium">Status</th>
                  <th className="p-3 text-start font-medium">Generated</th>
                  <th className="p-3 text-start font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {visibleLabels.map((l) => (
                  <tr key={l.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="p-3 text-xs">{l.entityType}</td>
                    <td className="p-3 font-mono text-xs">{l.entityId}</td>
                    <td className="p-3 font-mono text-xs">{l.barcodeVal}</td>
                    <td className="p-3 text-xs">{l.type}</td>
                    <td className="p-3">
                      {l.isActive
                        ? <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">Active</span>
                        : <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Inactive</span>
                      }
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{l.generatedAt.slice(0, 10)}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedLabelId(l.id)}
                        className="text-primary hover:underline text-xs"
                      >
                        Preview
                      </button>
                      {l.isActive && (
                        <>
                          <button
                            onClick={() => {
                              dispatch(addPrintJob({
                                id:          `pj-${Date.now()}`,
                                createdBy:   'current-user',
                                labelIds:    [l.id],
                                status:      PrintStatus.Queued,
                                printFormat: 'A4-single',
                                queuedAt:    new Date().toISOString(),
                              }));
                            }}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Print (F5.3)
                          </button>
                          <button
                            onClick={() => handleReplace(l.id)}
                            className="text-amber-600 hover:underline text-xs"
                          >
                            Replace
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar: preview + print queue */}
        <div className="space-y-4">
          <section className="rounded-xl border bg-background p-4 space-y-2">
            <h2 className="font-semibold text-sm">Label preview</h2>
            {selectedLabel ? (
              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground">{selectedLabel.barcodeVal}</p>
                <BarcodePreview code={selectedLabel.barcodeVal} type={selectedLabel.type} />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Select a label to preview.</p>
            )}
          </section>

          <section className="rounded-xl border bg-background p-4 space-y-2">
            <h2 className="font-semibold text-sm">Print queue</h2>
            <ul className="space-y-2 text-sm">
              {printJobs.map((j) => (
                <li key={j.id} className="border rounded-md p-2 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_COLOR[j.status]}`}>
                      {j.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{j.labelIds.length} labels</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{j.printFormat} · {j.queuedAt.slice(0, 10)}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/${local}/barcodes/print-job/${j.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Open
                    </Link>
                    {j.status !== PrintStatus.Done && (
                      <button
                        onClick={() => dispatch(cyclePrintJobStatus(j.id))}
                        className="text-xs h-6 px-2 rounded border hover:bg-muted"
                      >
                        Advance
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
