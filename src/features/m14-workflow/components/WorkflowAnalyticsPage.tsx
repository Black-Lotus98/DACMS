'use client';

import { useMemo } from 'react';
import { useWorkflowModule } from '../hooks';
import { ExecutionStatus } from '../types';

export function WorkflowAnalyticsPage() {
  const { workflows, executions } = useWorkflowModule();

  // ── Section 1: Execution summary counts ────────────────────────────────────
  const totalExecutions = executions.length;
  const runningCount    = executions.filter((e) => e.status === ExecutionStatus.Running).length;
  const completedCount  = executions.filter((e) => e.status === ExecutionStatus.Completed).length;
  const failedOrCancelledCount = executions.filter(
    (e) => e.status === ExecutionStatus.Failed || e.status === ExecutionStatus.Cancelled,
  ).length;

  // ── Section 2: Per-workflow aggregated stats ────────────────────────────────
  const workflowRows = useMemo(() => {
    return workflows.map((wf) => {
      const wfExecs = executions.filter((e) => e.wfId === wf.id);

      const totalExecs   = wfExecs.length;
      const completed    = wfExecs.filter((e) => e.status === ExecutionStatus.Completed).length;
      const running      = wfExecs.filter((e) => e.status === ExecutionStatus.Running).length;

      // Average completion time in hours (only executions that have completedAt)
      const completedExecs = wfExecs.filter((e) => e.completedAt);
      const avgCompletionHours =
        completedExecs.length === 0
          ? null
          : completedExecs.reduce((sum, e) => {
              const diff =
                new Date(e.completedAt!).getTime() - new Date(e.startedAt).getTime();
              return sum + diff / 3_600_000;
            }, 0) / completedExecs.length;

      // SLA breach count: an execution is counted as breached if any step in the
      // workflow has slaHours defined and the gap between consecutive actionHistory
      // entries (approximating step duration) exceeded that step's slaHours.
      let slaBreachCount = 0;
      for (const exe of wfExecs) {
        const history = exe.actionHistory;
        for (let i = 0; i < history.length; i++) {
          const record = history[i];
          const step   = wf.steps.find((s) => s.id === record.stepId);
          if (!step?.slaHours) continue;

          // Approximate step start: previous action's takenAt, or execution startedAt
          const stepStartMs =
            i === 0
              ? new Date(exe.startedAt).getTime()
              : new Date(history[i - 1].takenAt).getTime();
          const stepEndMs   = new Date(record.takenAt).getTime();
          const elapsedHours = (stepEndMs - stepStartMs) / 3_600_000;

          if (elapsedHours > step.slaHours) {
            slaBreachCount++;
            break; // count at most 1 breach per execution for this workflow
          }
        }
      }

      return { wf, totalExecs, completed, running, avgCompletionHours, slaBreachCount };
    });
  }, [workflows, executions]);

  // ── Section 3: Per-step SLA bottleneck details ─────────────────────────────
  const stepBreachRows = useMemo(() => {
    const rows: {
      wfNameEn:     string;
      stepNameEn:   string;
      slaHours:     number;
      breachCount:  number;
    }[] = [];

    for (const wf of workflows) {
      for (const step of wf.steps) {
        if (!step.slaHours) continue;

        let breachCount = 0;
        const wfExecs = executions.filter((e) => e.wfId === wf.id);

        for (const exe of wfExecs) {
          const history = exe.actionHistory;
          for (let i = 0; i < history.length; i++) {
            if (history[i].stepId !== step.id) continue;

            const stepStartMs =
              i === 0
                ? new Date(exe.startedAt).getTime()
                : new Date(history[i - 1].takenAt).getTime();
            const stepEndMs   = new Date(history[i].takenAt).getTime();
            const elapsedHours = (stepEndMs - stepStartMs) / 3_600_000;

            if (elapsedHours > step.slaHours) {
              breachCount++;
            }
          }
        }

        rows.push({
          wfNameEn:    wf.nameEn,
          stepNameEn:  step.nameEn,
          slaHours:    step.slaHours,
          breachCount,
        });
      }
    }

    return rows;
  }, [workflows, executions]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Workflow SLA Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Execution performance and SLA breach overview for all workflows.
        </p>
      </div>

      {/* ── Section 1: Summary cards ── */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Executions" value={totalExecutions} colorClass="text-foreground" />
        <StatCard label="Running"           value={runningCount}           colorClass="text-blue-600" />
        <StatCard label="Completed"         value={completedCount}         colorClass="text-green-600" />
        <StatCard label="Failed / Cancelled" value={failedOrCancelledCount} colorClass="text-red-600" />
      </section>

      {/* ── Section 2: Per-workflow table ── */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Per-Workflow Summary</h2>
        {workflowRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workflow definitions found.</p>
        ) : (
          <div className="rounded-xl border bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-semibold text-muted-foreground">
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Completed</th>
                  <th className="px-4 py-3 text-right">Running</th>
                  <th className="px-4 py-3 text-right">Avg Completion (h)</th>
                  <th className="px-4 py-3 text-right">SLA Breaches</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {workflowRows.map(({ wf, totalExecs, completed, running, avgCompletionHours, slaBreachCount }) => (
                  <tr key={wf.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{wf.nameEn}</td>
                    <td className="px-4 py-3 text-muted-foreground">{wf.type}</td>
                    <td className="px-4 py-3 text-right">{totalExecs}</td>
                    <td className="px-4 py-3 text-right text-green-700">{completed}</td>
                    <td className="px-4 py-3 text-right text-blue-700">{running}</td>
                    <td className="px-4 py-3 text-right">
                      {avgCompletionHours === null
                        ? <span className="text-muted-foreground">—</span>
                        : `${avgCompletionHours.toFixed(1)}h`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {slaBreachCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          {slaBreachCount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Section 3: Per-step bottleneck table ── */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Step-Level SLA Bottlenecks</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Only steps with an SLA defined are listed. Breach count is approximated using the
          time gap between consecutive action-history entries for each execution.
        </p>
        {stepBreachRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No steps with SLA hours configured.</p>
        ) : (
          <div className="rounded-xl border bg-background overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-semibold text-muted-foreground">
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3">Step</th>
                  <th className="px-4 py-3 text-right">SLA (h)</th>
                  <th className="px-4 py-3 text-right"># Times Breached</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stepBreachRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{row.wfNameEn}</td>
                    <td className="px-4 py-3 font-medium">{row.stepNameEn}</td>
                    <td className="px-4 py-3 text-right">{row.slaHours}h</td>
                    <td className="px-4 py-3 text-right">
                      {row.breachCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          {row.breachCount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Small helper component ───────────────────────────────────────────────────
function StatCard({
  label,
  value,
  colorClass,
}: {
  label:      string;
  value:      number;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border bg-background px-5 py-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
