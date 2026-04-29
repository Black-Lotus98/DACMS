'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { refreshOverdue, setRequestStatus } from '../store/slice';
import { LendingStatus } from '../types';
import { useLendingModule } from '../hooks';

export function LendingDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRequestById } = useLendingModule();
  const request = getRequestById(id);

  useEffect(() => {
    dispatch(refreshOverdue());
  }, [dispatch]);

  if (!request) {
    return <div className="space-y-2"><p>الطلب غير موجود.</p><Link className="text-primary hover:underline" href={`/${local}/lending`}>رجوع</Link></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تفاصيل طلب الإعارة</h1>
        <Link href={`/${local}/lending`} className="text-primary hover:underline">رجوع</Link>
      </div>
      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <p><span className="text-muted-foreground">المرجع:</span> <span className="font-mono">{request.recordRef}</span></p>
        <p><span className="text-muted-foreground">الجهة:</span> {request.requester}</p>
        <p><span className="text-muted-foreground">السبب:</span> {request.purpose}</p>
        <p><span className="text-muted-foreground">الاستحقاق:</span> {request.dueDate}</p>
        <p><span className="text-muted-foreground">الحالة:</span> {request.status}</p>
      </section>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={request.status !== LendingStatus.Pending}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Approved }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          اعتماد
        </button>
        <button
          disabled={request.status !== LendingStatus.Approved}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Active }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          تسليم
        </button>
        <button
          disabled={![LendingStatus.Active, LendingStatus.Overdue].includes(request.status)}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Returned }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          إرجاع
        </button>
      </div>
    </div>
  );
}
