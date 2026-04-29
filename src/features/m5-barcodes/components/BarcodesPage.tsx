'use client';

import { useState } from 'react';
import { useBarcodesModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { cyclePrintJobStatus } from '../store/slice';
import { BarcodePreview } from './BarcodePreview';
import { PrintStatus } from '../types';

export function BarcodesPage() {
  const dispatch = useAppDispatch();
  const { labels, printJobs } = useBarcodesModule();
  const [selectedLabelId, setSelectedLabelId] = useState(labels[0]?.id ?? '');
  const selectedLabel = labels.find((l) => l.id === selectedLabelId) ?? labels[0];

  function statusLabel(status: PrintStatus) {
    if (status === PrintStatus.Queued) return 'queued';
    if (status === PrintStatus.Printing) return 'printing';
    return 'done';
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">إدارة الباركود</h1><p className="text-sm text-muted-foreground">M5: توليد الملصقات وإدارة طوابير الطباعة.</p></div>
      <div className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2 rounded-xl border bg-background overflow-x-auto">
          <table className="w-full text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3 text-start">الكيان</th><th className="p-3 text-start">الرمز</th><th className="p-3 text-start">النوع</th><th className="p-3 text-start">الحالة</th><th className="p-3 text-start">المعاينة</th></tr></thead><tbody>{labels.map((l)=><tr key={l.id} className="border-b"><td className="p-3 font-mono">{l.entityId}</td><td className="p-3 font-mono">{l.code}</td><td className="p-3">{l.type}</td><td className="p-3">{l.active ? 'فعال' : 'غير فعال'}</td><td className="p-3"><button onClick={() => setSelectedLabelId(l.id)} className="text-primary hover:underline text-xs">عرض</button></td></tr>)}</tbody></table>
        </section>
        <section className="rounded-xl border bg-background p-4 space-y-3">
          <h2 className="font-semibold mb-2">طابور الطباعة</h2>
          <ul className="space-y-2 text-sm">
            {printJobs.map((j)=><li key={j.id} className="border rounded-md p-2 flex items-center justify-between gap-2"><div><p>{j.title}</p><p className="text-xs text-muted-foreground">{j.count} labels</p></div><div className="flex items-center gap-2"><span className="text-xs">{statusLabel(j.status)}</span><button onClick={() => dispatch(cyclePrintJobStatus(j.id))} className="h-7 px-2 rounded border text-xs hover:bg-muted">next</button></div></li>)}
          </ul>
          <div className="border-t pt-3">
            <h3 className="text-sm font-medium mb-2">معاينة الباركود</h3>
            {selectedLabel ? (
              <div className="rounded-md border p-2 space-y-2">
                <p className="text-xs text-muted-foreground font-mono">{selectedLabel.code}</p>
                <BarcodePreview code={selectedLabel.code} type={selectedLabel.type} />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">لا توجد بيانات للمعاينة.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
