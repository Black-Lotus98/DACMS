'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addWorkflow } from '../store/slice';
import { AssigneeType, StepType, WorkflowStatus, WorkflowType, type WorkflowStep } from '../types';

const STEP_TYPE_OPTIONS: StepType[] = [StepType.Trigger, StepType.Human, StepType.System, StepType.Decision, StepType.Watcher];
const ASSIGNEE_TYPE_OPTIONS: AssigneeType[] = [AssigneeType.Role, AssigneeType.User, AssigneeType.Department];
const WORKFLOW_TYPE_OPTIONS: WorkflowType[] = [WorkflowType.Archiving, WorkflowType.Lending, WorkflowType.Destruction, WorkflowType.Migration, WorkflowType.Custom];

const STEP_REQUIRES_ASSIGNEE: StepType[] = [StepType.Human, StepType.Watcher];

export function WorkflowDesignerPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { local } = useParams<{ local: string }>();

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [type, setType] = useState<WorkflowType>(WorkflowType.Custom);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: `step-${Date.now()}`, stepType: StepType.Trigger, nameAr: '', nameEn: '', order: 1 },
  ]);
  const [error, setError] = useState('');

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        stepType: StepType.Human,
        nameAr: '',
        nameEn: '',
        assigneeType: AssigneeType.Role,
        slaHours: 24,
        order: prev.length + 1,
      },
    ]);
  }

  function removeStep(id: string) {
    setSteps((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 }))
    );
  }

  function updateStep(id: string, patch: Partial<WorkflowStep>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function save() {
    if (!nameAr.trim() || !nameEn.trim()) { setError('Workflow name (AR and EN) is required.'); return; }
    if (steps.length === 0) { setError('At least one step is required.'); return; }
    if (steps.some((s) => !s.nameAr.trim() || !s.nameEn.trim())) { setError('All steps need Arabic and English names.'); return; }

    dispatch(addWorkflow({
      id: `wf-${Date.now()}`,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      type,
      status: WorkflowStatus.Draft,
      version: 1,
      createdBy: 'current-user',
      steps,
    }));

    router.push(`/${local}/workflow`);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Workflow Designer</h1>
        <p className="text-sm text-muted-foreground">Define steps, assignees, and SLA targets. Save as Draft to publish later.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">{error}</p>
      )}

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Workflow details</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name (Arabic)</label>
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="اسم سير العمل"
              dir="rtl"
              className="w-full h-9 rounded-md border px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name (English)</label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Workflow name"
              className="w-full h-9 rounded-md border px-3 text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Workflow type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WorkflowType)}
            className="w-full h-9 rounded-md border px-3 text-sm"
          >
            {WORKFLOW_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-xl border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Steps</h2>
          <button onClick={addStep} className="inline-flex items-center gap-1 text-xs h-7 px-2 rounded border hover:bg-muted">
            <Plus className="w-3 h-3" />
            Add step
          </button>
        </div>

        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="space-y-0">
              <div className="border rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{step.order}.</span>
                  <select
                    value={step.stepType}
                    onChange={(e) => updateStep(step.id, {
                      stepType: e.target.value as StepType,
                      assigneeType: STEP_REQUIRES_ASSIGNEE.includes(e.target.value as StepType) ? (step.assigneeType ?? AssigneeType.Role) : undefined,
                      slaHours: STEP_REQUIRES_ASSIGNEE.includes(e.target.value as StepType) ? (step.slaHours ?? 24) : undefined,
                    })}
                    className="h-7 rounded border px-2 text-xs"
                  >
                    {STEP_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length === 1}
                    className="text-muted-foreground hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  <input
                    value={step.nameAr}
                    onChange={(e) => updateStep(step.id, { nameAr: e.target.value })}
                    placeholder="اسم الخطوة"
                    dir="rtl"
                    className="h-8 rounded-md border px-3 text-sm"
                  />
                  <input
                    value={step.nameEn}
                    onChange={(e) => updateStep(step.id, { nameEn: e.target.value })}
                    placeholder="Step name"
                    className="h-8 rounded-md border px-3 text-sm"
                  />
                </div>

                {STEP_REQUIRES_ASSIGNEE.includes(step.stepType) && (
                  <div className="flex gap-2">
                    <select
                      value={step.assigneeType ?? AssigneeType.Role}
                      onChange={(e) => updateStep(step.id, { assigneeType: e.target.value as AssigneeType })}
                      className="h-8 rounded border px-2 text-xs flex-1"
                    >
                      {ASSIGNEE_TYPE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={step.slaHours ?? ''}
                        onChange={(e) => updateStep(step.id, { slaHours: Number(e.target.value) })}
                        placeholder="SLA h"
                        className="h-8 w-20 rounded-md border px-2 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">hrs SLA</span>
                    </div>
                  </div>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={save} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90">
          Save as Draft
        </button>
        <button onClick={() => router.push(`/${local}/workflow`)} className="h-9 px-4 rounded-md border text-sm hover:bg-muted">
          Cancel
        </button>
      </div>
    </div>
  );
}
