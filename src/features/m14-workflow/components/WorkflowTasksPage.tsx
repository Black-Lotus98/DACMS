'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { advanceExecution } from '../store/slice';
import { ExecutionStatus } from '../types';

const ENTITY_LINK: Record<string, (local: string, entityId: string) => string> = {
  RECORD:              (l, id) => `/${l}/records/${id}`,
  LENDING_REQUEST:     (l, id) => `/${l}/lending/${id}`,
  DESTRUCTION_REQUEST: (l, id) => `/${l}/destruction/${id}`,
};

const NEGATIVE_ACTIONS = ['reject', 'cancel', 'return', 'defer', 'hold'];

function isNegativeAction(act: string) {
  return NEGATIVE_ACTIONS.some((kw) => act.toLowerCase().includes(kw));
}

export function WorkflowTasksPage() {
  const dispatch  = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const user      = useAppSelector((s) => s.auth.user);
  const { getPendingTasksForUser, slaAlerts } = useWorkflowModule();

  // comment map: executionId → draft comment text
  const [comments, setComments] = useState<Record<string, string>>({});
  // confirm gate for negative actions: key = `${exeId}:${action}`
  const [pendingConfirm, setPendingConfirm] = useState<string | null>(null);

  if (!user) {
    return <p className="text-sm text-muted-foreground">Not authenticated.</p>;
  }

  const tasks = getPendingTasksForUser(user.id, user.role, user.userDepartments);

  function handleAction(executionId: string, act: string) {
    if (isNegativeAction(act)) {
      // Require confirmation + optional comment before dispatching
      const key = `${executionId}:${act}`;
      if (pendingConfirm !== key) {
        setPendingConfirm(key);
        return;
      }
    }
    dispatch(advanceExecution({
      executionId,
      action:  act,
      actorId: user!.id,
      comment: comments[executionId]?.trim() || undefined,
    }));
    setPendingConfirm(null);
    setComments((prev) => { const n = { ...prev }; delete n[executionId]; return n; });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Workflow steps currently assigned to you as <span className="font-medium">{user.role}</span>.
        </p>
      </div>

      {slaAlerts.length > 0 && (
        <div className="space-y-1">
          {slaAlerts.map((a) => (
            <div
              key={`${a.executionId}-${a.kind}`}
              className={`text-xs rounded-md border px-2 py-1 ${a.kind === 'BREACHED' ? 'border-red-300 bg-red-50 text-red-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}
            >
              SLA {a.kind === 'BREACHED' ? 'breached' : 'approaching'}: {a.workflowName} / {a.stepName} — {a.elapsedHours}h of {a.slaHours}h
            </div>
          ))}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-xl border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">No pending tasks for your role.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(({ exe, wf, step }) => {
            const slaAlert   = slaAlerts.find((a) => a.executionId === exe.id);
            const entityLink = ENTITY_LINK[exe.entityType]?.(local, exe.entityId);

            return (
              <div key={exe.id} className="rounded-xl border bg-background p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{step.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{step.nameAr}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Workflow: {wf.nameEn} — Entity: {exe.entityType} / {exe.entityId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs">
                    {slaAlert && (
                      <span className={`px-1.5 py-0.5 rounded font-medium ${slaAlert.kind === 'BREACHED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {slaAlert.kind === 'BREACHED' ? 'SLA Breached' : 'SLA Warning'}
                      </span>
                    )}
                    {step.slaHours && (
                      <span className="text-muted-foreground">SLA {step.slaHours}h</span>
                    )}
                  </div>
                </div>

                {entityLink && (
                  <Link href={entityLink} className="text-xs text-primary hover:underline">
                    View {exe.entityType.toLowerCase().replace(/_/g, ' ')} →
                  </Link>
                )}

                {/* Comment field — always visible for audit trail value */}
                <div>
                  <textarea
                    rows={2}
                    value={comments[exe.id] ?? ''}
                    onChange={(e) => setComments((prev) => ({ ...prev, [exe.id]: e.target.value }))}
                    placeholder="Optional comment / reason (recommended for rejections)"
                    className="w-full rounded-md border px-3 py-1.5 text-xs resize-none"
                  />
                </div>

                {/* Action buttons */}
                {step.actions && step.actions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {step.actions.map((act) => {
                        const confirmKey = `${exe.id}:${act}`;
                        const awaitingConfirm = pendingConfirm === confirmKey;
                        const negative = isNegativeAction(act);
                        return (
                          <button
                            key={act}
                            onClick={() => handleAction(exe.id, act)}
                            className={`h-8 px-3 rounded-md border text-xs transition-colors
                              ${awaitingConfirm
                                ? 'bg-red-600 text-white border-red-600 animate-pulse'
                                : negative
                                  ? 'border-red-200 text-red-700 hover:bg-red-50'
                                  : 'border-green-200 text-green-700 hover:bg-green-50'
                              }`}
                          >
                            {awaitingConfirm ? `Confirm ${act}` : act}
                          </button>
                        );
                      })}
                      {pendingConfirm?.startsWith(exe.id) && (
                        <button
                          onClick={() => setPendingConfirm(null)}
                          className="h-8 px-3 rounded-md border text-xs text-muted-foreground hover:bg-muted"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    {pendingConfirm?.startsWith(exe.id) && (
                      <p className="text-xs text-red-600">Click the button again to confirm this action.</p>
                    )}
                  </div>
                )}

                {exe.status === ExecutionStatus.Escalated && (
                  <p className="text-xs text-red-600">Escalated to: {exe.escalatedTo}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
