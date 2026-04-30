'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { approveRequest, confirmReturn, dispatchRequest, refreshOverdue, rejectRequest } from '../store/slice';
import { LendingStatus } from '../types';
import { useLendingModule } from '../hooks';

export function LendingDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRequestById, getItemsByRequestId, getDispatchesByRequestId } = useLendingModule();

  const request   = getRequestById(id);
  const items     = getItemsByRequestId(id);
  const dispatches = getDispatchesByRequestId(id);

  const [rejectionReason, setRejectionReason] = useState('');
  const [messengerId,     setMessengerId]     = useState('');

  useEffect(() => { dispatch(refreshOverdue()); }, [dispatch]);

  if (!request) {
    return (
      <div className="space-y-2">
        <p className="text-sm">Request not found.</p>
        <Link className="text-primary hover:underline text-sm" href={`/${local}/lending`}>Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lending request</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{request.refNo}</p>
        </div>
        <Link href={`/${local}/lending`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back
        </Link>
      </div>

      {/* Request details */}
      <section className="rounded-xl border bg-background p-4 space-y-2 text-sm">
        <h2 className="font-semibold mb-1">Details</h2>
        <div className="grid sm:grid-cols-2 gap-1">
          <p><span className="text-muted-foreground">Requester:</span> {request.requesterId}</p>
          <p><span className="text-muted-foreground">Department:</span> {request.deptId}</p>
          <p><span className="text-muted-foreground">Status:</span> {request.status}</p>
          <p><span className="text-muted-foreground">Requested:</span> {request.requestedAt.slice(0, 10)}</p>
          {request.dueDate    && <p><span className="text-muted-foreground">Due date:</span> {request.dueDate}</p>}
          {request.approvedBy && <p><span className="text-muted-foreground">Approved by:</span> {request.approvedBy}</p>}
          {request.returnedAt && <p><span className="text-muted-foreground">Returned at:</span> {request.returnedAt.slice(0, 10)}</p>}
          {request.rejectionReason && (
            <p className="sm:col-span-2 text-red-600"><span className="text-muted-foreground">Rejection reason:</span> {request.rejectionReason}</p>
          )}
        </div>
        <p className="pt-1"><span className="text-muted-foreground">Purpose:</span> {request.purpose}</p>
      </section>

      {/* Items */}
      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold text-sm mb-2">Lending items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 border rounded-md px-3 py-2">
                <span className="font-mono text-xs flex-1">{item.recordId}</span>
                <span className="text-xs text-muted-foreground">{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Actions */}
      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Actions</h2>

        {request.status === LendingStatus.Pending && (
          <div className="space-y-2">
            <button
              onClick={() => dispatch(approveRequest({ requestId: request.id, approvedBy: 'current-user' }))}
              className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Approve
            </button>
            <div className="flex gap-2">
              <input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason…"
                className="flex-1 h-9 rounded-md border px-3 text-sm"
              />
              <button
                onClick={() => {
                  if (!rejectionReason.trim()) return;
                  dispatch(rejectRequest({ requestId: request.id, rejectionReason }));
                }}
                className="h-9 px-3 rounded-md border text-sm text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {request.status === LendingStatus.Approved && (
          <div className="flex gap-2">
            <input
              value={messengerId}
              onChange={(e) => setMessengerId(e.target.value)}
              placeholder="Messenger ID…"
              className="flex-1 h-9 rounded-md border px-3 text-sm"
            />
            <button
              onClick={() => {
                if (!messengerId.trim()) return;
                dispatch(dispatchRequest({ requestId: request.id, messengerId }));
              }}
              className="h-9 px-3 rounded-md border text-sm"
            >
              Dispatch
            </button>
          </div>
        )}

        {(request.status === LendingStatus.Active || request.status === LendingStatus.Overdue) && (
          <button
            onClick={() => dispatch(confirmReturn({ requestId: request.id, itemIds: items.map((i) => i.id) }))}
            className="h-9 px-3 rounded-md border text-sm"
          >
            Confirm full return
          </button>
        )}
      </section>

      {/* Dispatches */}
      {dispatches.length > 0 && (
        <section className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold text-sm mb-2">Dispatch history</h2>
          <ul className="space-y-1 text-sm">
            {dispatches.map((d) => (
              <li key={d.id} className="flex items-center gap-3 border rounded-md px-3 py-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded font-medium ${d.direction === 'OUTBOUND' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {d.direction}
                </span>
                <span>Messenger: {d.messengerId}</span>
                <span className="text-muted-foreground">{d.dispatchedAt.slice(0, 10)}</span>
                {d.confirmedAt
                  ? <span className="text-green-600 ml-auto">Confirmed {d.confirmedAt.slice(0, 10)}</span>
                  : <span className="text-muted-foreground ml-auto">Pending confirmation</span>
                }
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
