'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useWorkflowModule } from '../hooks';
import { addWorkflow, advanceExecution, publishWorkflow } from '../store/slice';
import { StepType, WorkflowStatus } from '../types';

export function WorkflowPage() {
  const dispatch = useAppDispatch();
  const { workflows, executions } = useWorkflowModule();
  const [workflowName, setWorkflowName] = useState('');

  function createWorkflow() {
    if (!workflowName.trim()) return;
    dispatch(
      addWorkflow({
        id: `wf-${Date.now()}`,
        name: workflowName.trim(),
        status: WorkflowStatus.Draft,
        steps: [
          { id: `st-${Date.now()}-1`, name: 'مراجعة أولية', type: StepType.Review, slaHours: 8, order: 1 },
          { id: `st-${Date.now()}-2`, name: 'اعتماد', type: StepType.Approval, slaHours: 12, order: 2 },
        ],
      })
    );
    setWorkflowName('');
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">نظام سير العمل</h1><p className="text-sm text-muted-foreground">M14: تعريف المسارات ومتابعة التنفيذ.</p></div>
      <section className="rounded-xl border bg-background p-4 flex flex-wrap items-center gap-2">
        <input value={workflowName} onChange={(e)=>setWorkflowName(e.target.value)} placeholder="اسم سير العمل الجديد" className="h-9 rounded-md border px-3 text-sm min-w-64" />
        <button onClick={createWorkflow} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة سير عمل</button>
      </section>
      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-3">تعريفات سير العمل</h2>
        <div className="space-y-3">{workflows.map((w)=><div key={w.id} className="border rounded-md p-3"><div className="flex justify-between gap-2"><p className="font-medium">{w.name}</p><div className="flex items-center gap-2"><span className="text-xs">{w.status}</span><button onClick={() => dispatch(publishWorkflow(w.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">publish</button></div></div><p className="text-xs text-muted-foreground mt-1">{w.steps.length} steps</p></div>)}</div>
      </section>
      <section className="rounded-xl border bg-background p-4"><h2 className="font-semibold mb-3">حالات التنفيذ</h2><ul className="space-y-2 text-sm">{executions.map((e)=><li key={e.id} className="border rounded-md p-2 flex justify-between items-center gap-2"><div><p>{e.workflowId}</p><p className="text-xs text-muted-foreground">step {e.currentStep}</p></div><div className="flex items-center gap-2"><span>{e.status}</span><button onClick={() => dispatch(advanceExecution(e.id))} className="text-xs h-7 px-2 rounded border hover:bg-muted">advance</button></div></li>)}</ul></section>
    </div>
  );
}
