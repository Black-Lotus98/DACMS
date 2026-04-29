'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { advanceApprovalLevel, setDestructionStatus } from '../store/slice';
import { useDestructionModule } from '../hooks';
import { DestructionStatus } from '../types';

export function DestructionDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRequestById } = useDestructionModule();
  const request = getRequestById(id);

  if (!request) return <div className="space-y-2"><p>Request not found.</p><Link href={`/${local}/destruction`} className="text-primary hover:underline">Back</Link></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Destruction request details</h1>
        <Link href={`/${local}/destruction`} className="text-primary hover:underline">Back</Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <p><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{request.recordRef}</span></p>
        <p><span className="text-muted-foreground">Reason:</span> {request.reason}</p>
        <p><span className="text-muted-foreground">مستوى الApprove:</span> {request.approvalLevel}/3</p>
        <p><span className="text-muted-foreground">Status:</span> {request.status}</p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={request.status === DestructionStatus.Destroyed || request.approvalLevel >= 3}
          onClick={() => dispatch(advanceApprovalLevel(request.id))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Approve المرحلة التالية
        </button>
        <button
          disabled={request.approvalLevel < 3 || request.status === DestructionStatus.Destroyed}
          onClick={() => dispatch(setDestructionStatus({ id: request.id, status: DestructionStatus.Approved }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Approve نهائي
        </button>
        <button
          disabled={request.approvalLevel < 3 || request.status !== DestructionStatus.Approved}
          onClick={() => dispatch(setDestructionStatus({ id: request.id, status: DestructionStatus.Destroyed }))}
          className="h-9 px-3 rounded-md border text-sm disabled:opacity-40"
        >
          Destroy
        </button>
      </div>
    </div>
  );
}
