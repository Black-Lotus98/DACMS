'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { approveRequest, executeDestruction, rejectRequest, submitForLegalReview } from '../store/slice';
import { useDestructionModule } from '../hooks';
import { DestructionStatus } from '../types';

export function DestructionDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRequestById, getItemsByRequestId } = useDestructionModule();

  const request = getRequestById(id);
  const items   = getItemsByRequestId(id);

  const [rejectionReason, setRejectionReason] = useState('');

  if (!request) {
    return (
      <div className="space-y-2">
        <p className="text-sm">Request not found.</p>
        <Link href={`/${local}/destruction`} className="text-primary hover:underline text-sm">Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Destruction request</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{request.refNo}</p>
        </div>
        <Link href={`/${local}/destruction`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <h2 className="font-semibold mb-1">Details</h2>
        <div className="grid sm:grid-cols-2 gap-1">
          <p><span className="text-muted-foreground">Requester:</span> {request.requesterId}</p>
          <p><span className="text-muted-foreground">Status:</span> {request.status}</p>
          {request.approvedBy  && <p><span className="text-muted-foreground">Approved by:</span> {request.approvedBy}</p>}
          {request.executedAt  && <p><span className="text-muted-foreground">Executed:</span> {request.executedAt.slice(0, 10)}</p>}
          {request.rejectedBy  && <p><span className="text-muted-foreground">Rejected by:</span> {request.rejectedBy}</p>}
          {request.certificate && (
            <p className="sm:col-span-2">
              <span className="text-muted-foreground">Certificate:</span>{' '}
              <span className="font-mono text-xs">{request.certificate}</span>
            </p>
          )}
          {request.rejectionReason && (
            <p className="sm:col-span-2 text-red-600">
              <span className="text-muted-foreground">Rejection reason:</span> {request.rejectionReason}
            </p>
          )}
        </div>
        <p className="pt-1"><span className="text-muted-foreground">Justification:</span> {request.justification}</p>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold text-sm mb-2">Records in this request ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 border rounded-md px-3 py-2">
                <span className="font-mono text-xs flex-1">{item.recordId}</span>
                <span className="text-xs text-muted-foreground">Retention end: {item.retentionEnd}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Actions</h2>

        {request.status === DestructionStatus.Pending && (
          <button
            onClick={() => dispatch(submitForLegalReview(request.id))}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            Submit for legal review
          </button>
        )}

        {request.status === DestructionStatus.LegalReview && (
          <button
            onClick={() => dispatch(approveRequest({ requestId: request.id, approvedBy: 'current-user' }))}
            className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Approve (Director)
          </button>
        )}

        {request.status === DestructionStatus.Approved && (
          <button
            onClick={() => dispatch(executeDestruction({
              requestId:   request.id,
              certificate: `/certificates/${request.refNo}.pdf`,
            }))}
            className="h-9 px-3 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Execute destruction
          </button>
        )}

        {(request.status === DestructionStatus.Pending ||
          request.status === DestructionStatus.LegalReview) && (
          <div className="flex gap-2 pt-1">
            <input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason…"
              className="flex-1 h-9 rounded-md border px-3 text-sm"
            />
            <button
              onClick={() => {
                if (!rejectionReason.trim()) return;
                dispatch(rejectRequest({ requestId: request.id, rejectedBy: 'current-user', rejectionReason }));
              }}
              className="h-9 px-3 rounded-md border text-sm text-red-600 hover:bg-red-50"
            >
              Reject
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
