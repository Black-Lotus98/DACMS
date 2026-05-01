'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addExtensionRequest, approveExtension, approveRequest, confirmReturn, dispatchRequest, refreshOverdue, rejectExtension, rejectRequest } from '../store/slice';
import { ExtensionStatus, LendingStatus } from '../types';
import { useLendingModule } from '../hooks';
import { useAppSelector } from '@/store/hooks';

export function LendingDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRequestById, getItemsByRequestId, getDispatchesByRequestId, getExtensionsByRequestId } = useLendingModule();
  const currentUserId = useAppSelector((s) => s.auth.user?.id ?? 'unknown');

  const request    = getRequestById(id);
  const items      = getItemsByRequestId(id);
  const dispatches = getDispatchesByRequestId(id);
  const extensions = getExtensionsByRequestId(id);

  const [rejectionReason,  setRejectionReason]  = useState('');
  const [messengerId,      setMessengerId]       = useState('');
  const [extNewDate,       setExtNewDate]        = useState('');
  const [extReason,        setExtReason]         = useState('');
  const [extRejectReason,  setExtRejectReason]   = useState<Record<string, string>>({});

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

      {/* Extension requests (F6.8) */}
      {(request.status === LendingStatus.Active || request.status === LendingStatus.Overdue || extensions.length > 0) && (
        <section className="rounded-xl border bg-background p-4 space-y-3">
          <h2 className="font-semibold text-sm">Extension requests (F6.8)</h2>

          {/* Submit new extension */}
          {(request.status === LendingStatus.Active || request.status === LendingStatus.Overdue) && (
            <div className="space-y-2 pb-3 border-b">
              <p className="text-xs text-muted-foreground">Request a due date extension:</p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="date"
                  value={extNewDate}
                  onChange={(e) => setExtNewDate(e.target.value)}
                  className="h-9 rounded-md border px-3 text-sm"
                />
                <input
                  value={extReason}
                  onChange={(e) => setExtReason(e.target.value)}
                  placeholder="Reason…"
                  className="flex-1 min-w-48 h-9 rounded-md border px-3 text-sm"
                />
                <button
                  onClick={() => {
                    if (!extNewDate || !extReason.trim()) return;
                    dispatch(addExtensionRequest({
                      id:          `ext-${Date.now()}`,
                      requestId:   request.id,
                      requestedBy: currentUserId,
                      newDueDate:  extNewDate,
                      reason:      extReason.trim(),
                      status:      ExtensionStatus.Pending,
                      createdAt:   new Date().toISOString(),
                    }));
                    setExtNewDate(''); setExtReason('');
                  }}
                  className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {extensions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No extension requests.</p>
          ) : (
            <ul className="space-y-2">
              {extensions.map((ext) => (
                <li key={ext.id} className="border rounded-md p-3 text-sm space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ext.status === ExtensionStatus.Approved ? 'bg-green-100 text-green-700' : ext.status === ExtensionStatus.Rejected ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ext.status}
                    </span>
                    <span className="text-muted-foreground text-xs">New date: <span className="font-medium text-foreground">{ext.newDueDate}</span></span>
                    <span className="text-muted-foreground text-xs">By: {ext.requestedBy}</span>
                    <span className="text-muted-foreground text-xs">{ext.createdAt.slice(0, 10)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ext.reason}</p>
                  {ext.status === ExtensionStatus.Pending && (
                    <div className="flex gap-2 flex-wrap pt-1">
                      <button
                        onClick={() => dispatch(approveExtension({ extensionId: ext.id, reviewedBy: currentUserId }))}
                        className="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-xs"
                      >
                        Approve
                      </button>
                      <input
                        value={extRejectReason[ext.id] ?? ''}
                        onChange={(e) => setExtRejectReason((prev) => ({ ...prev, [ext.id]: e.target.value }))}
                        placeholder="Rejection reason…"
                        className="flex-1 min-w-36 h-7 rounded-md border px-2 text-xs"
                      />
                      <button
                        onClick={() => {
                          const reason = extRejectReason[ext.id]?.trim();
                          if (!reason) return;
                          dispatch(rejectExtension({ extensionId: ext.id, reviewedBy: currentUserId, rejectionReason: reason }));
                        }}
                        className="h-7 px-2.5 rounded-md border text-xs text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {ext.rejectionReason && (
                    <p className="text-xs text-red-600">Rejected: {ext.rejectionReason}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

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
