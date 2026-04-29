'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRecordsModule } from '../hooks';

export function RecordDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRecordById, getHistoryForRecord } = useRecordsModule();

  const record = getRecordById(id);
  const history = getHistoryForRecord(id);

  if (!record) {
    return (
      <div className="space-y-3">
        <p className="text-sm">السجل غير موجود.</p>
        <Link href={`/${local}/records`} className="text-primary hover:underline">العودة إلى السجلات</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تفاصيل السجل</h1>
        <Link href={`/${local}/records`} className="text-primary hover:underline">رجوع</Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <p><span className="text-muted-foreground">المرجع:</span> <span className="font-mono">{record.refNo}</span></p>
        <p><span className="text-muted-foreground">العنوان:</span> {record.title}</p>
        <p><span className="text-muted-foreground">النوع:</span> {record.docType}</p>
        <p><span className="text-muted-foreground">الصندوق:</span> <span className="font-mono text-xs">{record.boxCode}</span></p>
        <p><span className="text-muted-foreground">الحالة:</span> {record.status}</p>
        <p><span className="text-muted-foreground">السرية:</span> {record.secrecy}</p>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">سجل التحركات</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد تحركات لهذا السجل حتى الآن.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="border rounded-md p-2">
                {h.fromBox} → {h.toBox}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
