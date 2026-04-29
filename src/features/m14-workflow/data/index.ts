import { ExecutionStatus, StepType, WorkflowStatus, type Workflow, type WorkflowExecution } from '../types';

export const workflowsSeed: Workflow[] = [
  {
    id: 'wf1',
    name: 'سير Approve الأرشفة',
    status: WorkflowStatus.Published,
    steps: [
      { id: 's1', name: 'Initial review', type: StepType.Review, slaHours: 8, order: 1 },
      { id: 's2', name: 'Approve المشرف', type: StepType.Approval, slaHours: 12, order: 2 },
      { id: 's3', name: 'Execution notification', type: StepType.Notify, slaHours: 2, order: 3 },
    ],
  },
  {
    id: 'wf2',
    name: 'سير طلب الإعارة',
    status: WorkflowStatus.Draft,
    steps: [
      { id: 's4', name: 'تدقيق الطلب', type: StepType.Review, slaHours: 6, order: 1 },
      { id: 's5', name: 'Approve المدير', type: StepType.Approval, slaHours: 24, order: 2 },
    ],
  },
];

export const executionsSeed: WorkflowExecution[] = [
  { id: 'exe1', workflowId: 'wf1', currentStep: 2, status: ExecutionStatus.InProgress },
  { id: 'exe2', workflowId: 'wf1', currentStep: 3, status: ExecutionStatus.Done },
];
