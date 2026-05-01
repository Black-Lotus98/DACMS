export enum WorkflowType {
  Archiving   = 'ARCHIVING',
  Lending     = 'LENDING',
  Destruction = 'DESTRUCTION',
  Migration   = 'MIGRATION',
  Custom      = 'CUSTOM',
}

export enum WorkflowStatus {
  Draft     = 'DRAFT',
  Published = 'PUBLISHED',
  Archived  = 'ARCHIVED',
}

export enum StepType {
  Trigger  = 'TRIGGER',
  Human    = 'HUMAN',
  System   = 'SYSTEM',
  Decision = 'DECISION',
  Watcher  = 'WATCHER',
}

export enum AssigneeType {
  Role       = 'ROLE',
  User       = 'USER',
  Department = 'DEPARTMENT',
}

export enum ExecutionStatus {
  Running   = 'RUNNING',
  Completed = 'COMPLETED',
  Failed    = 'FAILED',
  Cancelled = 'CANCELLED',
  Escalated = 'ESCALATED',
}

export enum TriggerType {
  Manual = 'MANUAL',
  Auto   = 'AUTO',
}

// -----------------------------------------------------------
// Step action record — one entry per human action taken
// -----------------------------------------------------------
export interface StepActionRecord {
  stepId:   string;
  action:   string;       // e.g. 'Approve', 'Reject'
  actorId:  string;
  takenAt:  string;       // ISO timestamp
  comment?: string;
}

// -----------------------------------------------------------
// WorkflowStep — order removed; topology defined by edges
// -----------------------------------------------------------
export interface WorkflowStep {
  id:           string;
  stepType:     StepType;
  nameAr:       string;
  nameEn:       string;
  assigneeType?: AssigneeType;
  assigneeId?:  string;       // role key, userId, or deptId
  slaHours?:    number;
  actions?:     string[];     // e.g. ['Approve', 'Reject'] for Human steps
  triggerType?: TriggerType;  // only for Trigger steps
  // Canvas position (persisted so layout survives edit round-trips)
  posX?: number;
  posY?: number;
}

// -----------------------------------------------------------
// WorkflowEdge — explicit directed edge between two steps
// -----------------------------------------------------------
export interface WorkflowEdge {
  id:      string;
  source:  string;    // step id
  target:  string;    // step id
  label?:  string;    // e.g. 'Approved', 'Rejected' on Decision branches
}

// -----------------------------------------------------------
// Workflow definition
// -----------------------------------------------------------
export interface Workflow {
  id:        string;
  nameAr:    string;
  nameEn:    string;
  type:      WorkflowType;
  status:    WorkflowStatus;
  version:   number;
  createdBy: string;
  parentId?: string;        // links to previous version's id (F14.7)
  steps:     WorkflowStep[];
  edges:     WorkflowEdge[];
}

// -----------------------------------------------------------
// WorkflowExecution — runtime instance
// -----------------------------------------------------------
export interface WorkflowExecution {
  id:             string;
  wfId:           string;
  entityType:     string;   // 'LENDING_REQUEST' | 'DESTRUCTION_REQ' | 'RECORD' etc.
  entityId:       string;
  status:         ExecutionStatus;
  currentStepId?: string;
  startedAt:      string;
  currentStepStartedAt?: string;   // when the current step became active (for accurate SLA)
  completedAt?:   string;
  escalatedTo?:   string;          // userId / role that received the escalation (F14.8)
  actionHistory:  StepActionRecord[];
}

export interface WorkflowsState {
  definitions: Workflow[];
  executions:  WorkflowExecution[];
}
