export enum WorkflowStatus { Draft='draft', Published='published', Archived='archived' }
export enum StepType { Approval='approval', Review='review', Notify='notify' }
export enum ExecutionStatus { Pending='pending', InProgress='in_progress', Done='done' }

export interface WorkflowStep { id: string; name: string; type: StepType; slaHours: number; order: number }
export interface Workflow { id: string; name: string; status: WorkflowStatus; steps: WorkflowStep[] }
export interface WorkflowExecution { id: string; workflowId: string; currentStep: number; status: ExecutionStatus }
export interface WorkflowsState { definitions: Workflow[]; executions: WorkflowExecution[] }
