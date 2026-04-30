export enum WorkflowType {
  Archiving = 'ARCHIVING',
  Lending = 'LENDING',
  Destruction = 'DESTRUCTION',
  Migration = 'MIGRATION',
  Custom = 'CUSTOM',
}

export enum WorkflowStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
}

export enum StepType {
  Trigger = 'TRIGGER',
  Human = 'HUMAN',
  System = 'SYSTEM',
  Decision = 'DECISION',
  Watcher = 'WATCHER',
}

export enum AssigneeType {
  Role = 'ROLE',
  User = 'USER',
  Department = 'DEPARTMENT',
}

export enum ExecutionStatus {
  Running = 'RUNNING',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Cancelled = 'CANCELLED',
}

export interface WorkflowStep {
  id: string;
  stepType: StepType;
  nameAr: string;
  nameEn: string;
  assigneeType?: AssigneeType;
  slaHours?: number;
  order: number;
}

export interface Workflow {
  id: string;
  nameAr: string;
  nameEn: string;
  type: WorkflowType;
  status: WorkflowStatus;
  version: number;
  createdBy: string;
  steps: WorkflowStep[];
}

export interface WorkflowExecution {
  id: string;
  wfId: string;
  entityType: string;
  entityId: string;
  status: ExecutionStatus;
  currentStepId?: string;
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowsState {
  definitions: Workflow[];
  executions: WorkflowExecution[];
}
