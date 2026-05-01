'use client';

import { useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addWorkflow, updateWorkflow } from '../store/slice';
import { workflowSchema } from '../schemas';
import {
  AssigneeType,
  StepType,
  TriggerType,
  WorkflowStatus,
  WorkflowType,
  type Workflow,
  type WorkflowEdge,
  type WorkflowStep,
} from '../types';
import { RoleType } from '@/config/roles';

// -------------------------------------------------------
// Constants
// -------------------------------------------------------
const STEP_TYPE_OPTIONS: StepType[] = [
  StepType.Trigger, StepType.Human, StepType.System, StepType.Decision, StepType.Watcher,
];
const WORKFLOW_TYPE_OPTIONS: WorkflowType[] = [
  WorkflowType.Archiving, WorkflowType.Lending, WorkflowType.Destruction,
  WorkflowType.Migration, WorkflowType.Custom,
];
const ROLE_OPTIONS = Object.values(RoleType);

const STEP_COLOR: Record<StepType, string> = {
  [StepType.Trigger]:  '#3b82f6',
  [StepType.Human]:    '#f59e0b',
  [StepType.System]:   '#22c55e',
  [StepType.Decision]: '#a855f7',
  [StepType.Watcher]:  '#6b7280',
};

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function stepsToNodes(steps: WorkflowStep[]): Node[] {
  return steps.map((s) => ({
    id:       s.id,
    position: { x: s.posX ?? 250, y: s.posY ?? 100 },
    data:     { label: s.nameEn || s.stepType, stepType: s.stepType },
    style: {
      background: STEP_COLOR[s.stepType],
      color: '#fff',
      borderRadius: s.stepType === StepType.Decision ? '4px' : '8px',
      border: 'none',
      padding: '8px 14px',
      fontSize: '12px',
      fontWeight: 500,
      minWidth: 140,
    },
  }));
}

function edgesToFlow(edges: WorkflowEdge[]): Edge[] {
  return edges.map((e) => ({
    id:     e.id,
    source: e.source,
    target: e.target,
    label:  e.label,
    type:   'smoothstep',
    animated: false,
  }));
}

// -------------------------------------------------------
// Props — pass existingWorkflow to edit mode
// -------------------------------------------------------
interface Props {
  existingWorkflow?: Workflow;
}

export function WorkflowDesignerPage({ existingWorkflow }: Props) {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { local } = useParams<{ local: string }>();
  const userId   = useAppSelector((s) => s.auth.user?.id ?? 'system');

  const isEdit = !!existingWorkflow;

  // -------------------------------------------------------
  // Header fields
  // -------------------------------------------------------
  const [nameAr, setNameAr] = useState(existingWorkflow?.nameAr ?? '');
  const [nameEn, setNameEn] = useState(existingWorkflow?.nameEn ?? '');
  const [wfType, setWfType] = useState<WorkflowType>(existingWorkflow?.type ?? WorkflowType.Custom);

  // -------------------------------------------------------
  // Step registry (source of truth; canvas syncs from here)
  // -------------------------------------------------------
  const [steps, setSteps] = useState<WorkflowStep[]>(existingWorkflow?.steps ?? []);

  // -------------------------------------------------------
  // ReactFlow state
  // -------------------------------------------------------
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(stepsToNodes(steps));
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(
    existingWorkflow ? edgesToFlow(existingWorkflow.edges) : [],
  );

  // -------------------------------------------------------
  // Selection state — step XOR edge
  // -------------------------------------------------------
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const selectedStep = steps.find((s) => s.id === selectedStepId) ?? null;
  const selectedEdge = rfEdges.find((e) => e.id === selectedEdgeId) ?? null;

  // -------------------------------------------------------
  // Validation / save state
  // -------------------------------------------------------
  const [errors, setErrors]   = useState<string[]>([]);
  const [saved, setSaved]     = useState(false);

  // -------------------------------------------------------
  // Sync steps → ReactFlow nodes
  // -------------------------------------------------------
  function syncNodeLabel(stepId: string, label: string) {
    setRfNodes((prev) =>
      prev.map((n) => (n.id === stepId ? { ...n, data: { ...n.data, label } } : n)),
    );
  }

  // -------------------------------------------------------
  // Add a step from the palette
  // -------------------------------------------------------
  function addStepFromPalette(type: StepType) {
    const id   = `step-${Date.now()}`;
    const posY = steps.length * 110 + 50;
    const newStep: WorkflowStep = {
      id,
      stepType:    type,
      nameAr:      '',
      nameEn:      '',
      triggerType: type === StepType.Trigger ? TriggerType.Auto : undefined,
      assigneeType: [StepType.Human, StepType.Watcher].includes(type) ? AssigneeType.Role : undefined,
      slaHours:    [StepType.Human, StepType.Watcher].includes(type) ? 24 : undefined,
      actions:     type === StepType.Human ? ['Approve', 'Reject'] : undefined,
      posX: 250, posY,
    };
    setSteps((prev) => [...prev, newStep]);
    setRfNodes((prev) => [...prev, ...stepsToNodes([newStep])]);
    setSelectedStepId(id);
  }

  // -------------------------------------------------------
  // Remove a step (and its edges)
  // -------------------------------------------------------
  function removeStep(stepId: string) {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
    setRfNodes((prev) => prev.filter((n) => n.id !== stepId));
    setRfEdges((prev) => prev.filter((e) => e.source !== stepId && e.target !== stepId));
    if (selectedStepId === stepId) setSelectedStepId(null);
  }

  // -------------------------------------------------------
  // Update step fields
  // -------------------------------------------------------
  function patchStep(id: string, patch: Partial<WorkflowStep>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    if (patch.nameEn !== undefined) syncNodeLabel(id, patch.nameEn);
  }

  // -------------------------------------------------------
  // ReactFlow callbacks
  // -------------------------------------------------------
  const onConnect = useCallback(
    (conn: Connection) => {
      const edge: Edge = {
        id:     `e-${conn.source}-${conn.target}-${Date.now()}`,
        source: conn.source!,
        target: conn.target!,
        type:   'smoothstep',
      };
      setRfEdges((prev) => addEdge(edge, prev));
    },
    [setRfEdges],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedStepId(node.id);
      setSelectedEdgeId(null);
    },
    [],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      setSelectedEdgeId(edge.id);
      setSelectedStepId(null);
    },
    [],
  );

  function patchEdgeLabel(edgeId: string, label: string) {
    setRfEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, label: label || undefined } : e)),
    );
  }

  function removeEdgeById(edgeId: string) {
    setRfEdges((prev) => prev.filter((e) => e.id !== edgeId));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  }

  // Sync canvas positions back to steps when nodes are dragged
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === node.id ? { ...s, posX: node.position.x, posY: node.position.y } : s,
        ),
      );
    },
    [],
  );

  // -------------------------------------------------------
  // Build workflow object and validate
  // -------------------------------------------------------
  function buildPayload(): Workflow {
    const edges: WorkflowEdge[] = rfEdges.map((e) => ({
      id:     e.id,
      source: e.source,
      target: e.target,
      label:  typeof e.label === 'string' ? e.label : undefined,
    }));

    return {
      id:        existingWorkflow?.id ?? `wf-${Date.now()}`,
      nameAr:    nameAr.trim(),
      nameEn:    nameEn.trim(),
      type:      wfType,
      status:    existingWorkflow?.status ?? WorkflowStatus.Draft,
      version:   existingWorkflow?.version ?? 1,
      createdBy: userId,
      parentId:  existingWorkflow?.parentId,
      steps,
      edges,
    };
  }

  function validate(): boolean {
    const payload = buildPayload();
    const result  = workflowSchema.safeParse(payload);
    if (result.success) {
      setErrors([]);
      return true;
    }
    setErrors(result.error.issues.map((i) => i.message));
    return false;
  }

  // -------------------------------------------------------
  // Save as Draft
  // -------------------------------------------------------
  function saveAsDraft() {
    const payload = buildPayload();
    if (isEdit) {
      dispatch(updateWorkflow(payload));
    } else {
      dispatch(addWorkflow(payload));
    }
    setSaved(true);
    setTimeout(() => router.push(`/${local}/workflow`), 800);
  }

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold">{isEdit ? 'Edit Workflow' : 'New Workflow Designer'}</h1>
          <p className="text-xs text-muted-foreground">Build by clicking nodes in the palette, then draw edges on the canvas.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={validate}
            className="h-8 px-3 rounded-md border text-xs hover:bg-muted"
          >
            Validate
          </button>
          <button
            onClick={saveAsDraft}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : 'Save as Draft'}
          </button>
          <button
            onClick={() => router.push(`/${local}/workflow`)}
            className="h-8 px-3 rounded-md border text-xs hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="shrink-0 rounded-md border border-red-200 bg-red-50 px-3 py-2 space-y-0.5">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-700">{e}</p>
          ))}
        </div>
      )}

      {/* Header fields */}
      <div className="shrink-0 grid sm:grid-cols-3 gap-3">
        <input
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          placeholder="اسم سير العمل (عربي)"
          dir="rtl"
          className="h-9 rounded-md border px-3 text-sm"
        />
        <input
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Workflow name (English)"
          className="h-9 rounded-md border px-3 text-sm"
        />
        <select
          value={wfType}
          onChange={(e) => setWfType(e.target.value as WorkflowType)}
          className="h-9 rounded-md border px-3 text-sm"
        >
          {WORKFLOW_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Main canvas area */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Palette */}
        <div className="w-40 shrink-0 rounded-xl border bg-background p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Step types</p>
          {STEP_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => addStepFromPalette(type)}
              className="w-full flex items-center gap-1.5 text-xs h-8 px-2 rounded-md border hover:bg-muted text-start"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: STEP_COLOR[type] }}
              />
              <Plus className="w-3 h-3 text-muted-foreground shrink-0" />
              {type}
            </button>
          ))}
          <hr className="my-2" />
          <p className="text-xs text-muted-foreground">Steps ({steps.length})</p>
          {steps.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedStepId(s.id)}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded-md cursor-pointer border ${selectedStepId === s.id ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted'}`}
            >
              <span className="truncate">{s.nameEn || s.stepType}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeStep(s.id); }}
                className="text-muted-foreground hover:text-red-500 ml-1 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* ReactFlow canvas */}
        <div className="flex-1 rounded-xl border overflow-hidden">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={onNodeDragStop}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Config panel */}
        <div className="w-56 shrink-0 rounded-xl border bg-background p-3 space-y-3 overflow-y-auto">
          {/* Edge config */}
          {selectedEdge && !selectedStep && (
            <>
              <p className="text-xs font-semibold">Configure edge</p>
              <p className="text-xs text-muted-foreground">
                {rfNodes.find((n) => n.id === selectedEdge.source)?.data?.label as string ?? selectedEdge.source}
                {' → '}
                {rfNodes.find((n) => n.id === selectedEdge.target)?.data?.label as string ?? selectedEdge.target}
              </p>
              <div>
                <label className="text-xs text-muted-foreground">Branch label</label>
                <input
                  value={typeof selectedEdge.label === 'string' ? selectedEdge.label : ''}
                  onChange={(e) => patchEdgeLabel(selectedEdge.id, e.target.value)}
                  placeholder="Approved / Rejected / …"
                  className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                />
                <p className="text-xs text-muted-foreground mt-1">Required on Decision node outgoing edges to enable branching.</p>
              </div>
              <button
                onClick={() => removeEdgeById(selectedEdge.id)}
                className="w-full h-8 rounded-md border text-xs text-red-600 hover:bg-red-50 border-red-200"
              >
                Remove edge
              </button>
            </>
          )}
          {!selectedStep && !selectedEdge ? (
            <p className="text-xs text-muted-foreground">Click a node or edge to configure it.</p>
          ) : selectedStep && !selectedEdge && (
            <>
              <p className="text-xs font-semibold">Configure step</p>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Name (Arabic)</label>
                  <input
                    value={selectedStep.nameAr}
                    onChange={(e) => patchStep(selectedStep.id, { nameAr: e.target.value })}
                    dir="rtl"
                    className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                    placeholder="اسم الخطوة"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Name (English)</label>
                  <input
                    value={selectedStep.nameEn}
                    onChange={(e) => patchStep(selectedStep.id, { nameEn: e.target.value })}
                    className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                    placeholder="Step name"
                  />
                </div>

                {[StepType.Human, StepType.Watcher].includes(selectedStep.stepType) && (
                  <>
                    <div>
                      <label className="text-xs text-muted-foreground">Assignee type</label>
                      <select
                        value={selectedStep.assigneeType ?? AssigneeType.Role}
                        onChange={(e) => patchStep(selectedStep.id, { assigneeType: e.target.value as AssigneeType })}
                        className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                      >
                        <option value={AssigneeType.Role}>Role</option>
                        <option value={AssigneeType.User}>User</option>
                        <option value={AssigneeType.Department}>Department</option>
                      </select>
                    </div>
                    {selectedStep.assigneeType === AssigneeType.Role && (
                      <div>
                        <label className="text-xs text-muted-foreground">Role</label>
                        <select
                          value={selectedStep.assigneeId ?? ''}
                          onChange={(e) => patchStep(selectedStep.id, { assigneeId: e.target.value })}
                          className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                        >
                          <option value="">— select role —</option>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedStep.assigneeType !== AssigneeType.Role && (
                      <div>
                        <label className="text-xs text-muted-foreground">
                          {selectedStep.assigneeType === AssigneeType.Department ? 'Dept ID' : 'User ID'}
                        </label>
                        <input
                          value={selectedStep.assigneeId ?? ''}
                          onChange={(e) => patchStep(selectedStep.id, { assigneeId: e.target.value })}
                          className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-muted-foreground">SLA (hours)</label>
                      <input
                        type="number"
                        min={1}
                        value={selectedStep.slaHours ?? ''}
                        onChange={(e) => patchStep(selectedStep.id, { slaHours: Number(e.target.value) })}
                        className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                      />
                    </div>
                  </>
                )}

                {selectedStep.stepType === StepType.Human && (
                  <div>
                    <label className="text-xs text-muted-foreground">Actions (comma-separated)</label>
                    <input
                      value={(selectedStep.actions ?? []).join(', ')}
                      onChange={(e) =>
                        patchStep(selectedStep.id, {
                          actions: e.target.value.split(',').map((a) => a.trim()).filter(Boolean),
                        })
                      }
                      className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                      placeholder="Approve, Reject"
                    />
                  </div>
                )}

                {selectedStep.stepType === StepType.Trigger && (
                  <div>
                    <label className="text-xs text-muted-foreground">Trigger type</label>
                    <select
                      value={selectedStep.triggerType ?? TriggerType.Auto}
                      onChange={(e) => patchStep(selectedStep.id, { triggerType: e.target.value as TriggerType })}
                      className="w-full h-8 rounded-md border px-2 text-xs mt-0.5"
                    >
                      <option value={TriggerType.Auto}>Auto</option>
                      <option value={TriggerType.Manual}>Manual</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={() => removeStep(selectedStep.id)}
                  className="w-full h-8 rounded-md border text-xs text-red-600 hover:bg-red-50 border-red-200"
                >
                  Remove step
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
