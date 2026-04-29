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
    return <div className="space-y-2"><p>Request not found.</p><Link className="text-primary hover:underline" href={`/${local}/lending`}>Back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lending request details</h1>
        <Link href={`/${local}/lending`} className="text-primary hover:underline">Back</Link>
      </div>
      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <p><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{request.recordRef}</span></p>
        <p><span className="text-muted-foreground">Department:</span> {request.requester}</p>
        <p><span className="text-muted-foreground">Reason:</span> {request.purpose}</p>
        <p><span className="text-muted-foreground">Due date:</span> {request.dueDate}</p>
        <p><span className="text-muted-foreground">Status:</span> {request.status}</p>
      </section>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={request.status !== LendingStatus.Pending}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Approved }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Approve
        </button>
        <button
          disabled={request.status !== LendingStatus.Approved}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Active }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Dispatch
        </button>
        <button
          disabled={![LendingStatus.Active, LendingStatus.Overdue].includes(request.status)}
          onClick={()=>dispatch(setRequestStatus({ id: request.id, status: LendingStatus.Returned }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Return
        </button>
      </div>
    </div>
  );
}
