import {
  AssigneeType,
  ExecutionStatus,
  StepType,
  WorkflowStatus,
  WorkflowType,
  type Workflow,
  type WorkflowExecution,
} from '../types';

// F14.3 — Archive Intake: Trigger → Data Entry → Review → Approve → Location Assignment
const archivingWorkflow: Workflow = {
  id: 'wf-archiving',
  nameAr: 'سير أرشفة المستندات',
  nameEn: 'Archive Intake Workflow',
  type: WorkflowType.Archiving,
  status: WorkflowStatus.Published,
  version: 1,
  createdBy: 'system',
  steps: [
    { id: 'wfa-s1', stepType: StepType.Trigger,  nameAr: 'بدء الأرشفة',         nameEn: 'Start Intake',           order: 1 },
    { id: 'wfa-s2', stepType: StepType.Human,   nameAr: 'إدخال البيانات',        nameEn: 'Data Entry',             order: 2, assigneeType: AssigneeType.Role, slaHours: 8 },
    { id: 'wfa-s3', stepType: StepType.Human,   nameAr: 'مراجعة الوثائق',        nameEn: 'Document Review',        order: 3, assigneeType: AssigneeType.Role, slaHours: 12 },
    { id: 'wfa-s4', stepType: StepType.Human,   nameAr: 'اعتماد الأرشفة',        nameEn: 'Approve Archiving',      order: 4, assigneeType: AssigneeType.Role, slaHours: 24 },
    { id: 'wfa-s5', stepType: StepType.Human,   nameAr: 'تعيين الموقع المادي',   nameEn: 'Location Assignment',    order: 5, assigneeType: AssigneeType.Role, slaHours: 4 },
  ],
};

// F14.4 — Lending Request: Trigger → Requester Input → Supervisor Approval → Dispatch → Return Confirmation
const lendingWorkflow: Workflow = {
  id: 'wf-lending',
  nameAr: 'سير طلب الإعارة',
  nameEn: 'Lending Request Workflow',
  type: WorkflowType.Lending,
  status: WorkflowStatus.Published,
  version: 1,
  createdBy: 'system',
  steps: [
    { id: 'wfl-s1', stepType: StepType.Trigger, nameAr: 'بدء طلب الإعارة',       nameEn: 'Start Lending Request',      order: 1 },
    { id: 'wfl-s2', stepType: StepType.Human,  nameAr: 'بيانات الطلب',           nameEn: 'Requester Input',            order: 2, assigneeType: AssigneeType.Department, slaHours: 4 },
    { id: 'wfl-s3', stepType: StepType.Human,  nameAr: 'موافقة المشرف',          nameEn: 'Supervisor Approval',        order: 3, assigneeType: AssigneeType.Role, slaHours: 24 },
    { id: 'wfl-s4', stepType: StepType.Human,  nameAr: 'إرسال الوثيقة',          nameEn: 'Archive Officer Dispatch',   order: 4, assigneeType: AssigneeType.Role, slaHours: 8 },
    { id: 'wfl-s5', stepType: StepType.Human,  nameAr: 'تأكيد الإعادة',          nameEn: 'Return Confirmation',        order: 5, assigneeType: AssigneeType.Role, slaHours: 4 },
  ],
};

// F14.5 — Destruction Approval: Trigger → Supervisor → Legal Review → Director Approval → Execution
const destructionWorkflow: Workflow = {
  id: 'wf-destruction',
  nameAr: 'سير اعتماد الإتلاف',
  nameEn: 'Destruction Approval Workflow',
  type: WorkflowType.Destruction,
  status: WorkflowStatus.Published,
  version: 1,
  createdBy: 'system',
  steps: [
    { id: 'wfd-s1', stepType: StepType.Trigger, nameAr: 'بدء طلب الإتلاف',      nameEn: 'Start Destruction Request',  order: 1 },
    { id: 'wfd-s2', stepType: StepType.Human,  nameAr: 'موافقة المشرف',          nameEn: 'Supervisor Approval',        order: 2, assigneeType: AssigneeType.Role, slaHours: 24 },
    { id: 'wfd-s3', stepType: StepType.Human,  nameAr: 'المراجعة القانونية',     nameEn: 'Legal Review',               order: 3, assigneeType: AssigneeType.Role, slaHours: 48 },
    { id: 'wfd-s4', stepType: StepType.Human,  nameAr: 'اعتماد المدير',          nameEn: 'Director Approval',          order: 4, assigneeType: AssigneeType.Role, slaHours: 48 },
    { id: 'wfd-s5', stepType: StepType.System, nameAr: 'تنفيذ الإتلاف',          nameEn: 'Execute Destruction',        order: 5 },
  ],
};

// F14.6 — Migration Request: Trigger → Supervisor → Director Approval → Technical Execution
const migrationWorkflow: Workflow = {
  id: 'wf-migration',
  nameAr: 'سير طلب الترحيل',
  nameEn: 'Migration Request Workflow',
  type: WorkflowType.Migration,
  status: WorkflowStatus.Published,
  version: 1,
  createdBy: 'system',
  steps: [
    { id: 'wfm-s1', stepType: StepType.Trigger, nameAr: 'بدء طلب الترحيل',      nameEn: 'Start Migration Request',    order: 1 },
    { id: 'wfm-s2', stepType: StepType.Human,  nameAr: 'موافقة المشرف',          nameEn: 'Supervisor Approval',        order: 2, assigneeType: AssigneeType.Role, slaHours: 24 },
    { id: 'wfm-s3', stepType: StepType.Human,  nameAr: 'اعتماد المدير',          nameEn: 'Director Approval',          order: 3, assigneeType: AssigneeType.Role, slaHours: 48 },
    { id: 'wfm-s4', stepType: StepType.System, nameAr: 'التنفيذ التقني',          nameEn: 'Technical Execution',        order: 4 },
  ],
};

export const workflowsSeed: Workflow[] = [
  archivingWorkflow,
  lendingWorkflow,
  destructionWorkflow,
  migrationWorkflow,
];

export const executionsSeed: WorkflowExecution[] = [
  {
    id: 'exe-1',
    wfId: 'wf-lending',
    entityType: 'LENDING_REQUEST',
    entityId: 'lr-001',
    status: ExecutionStatus.Running,
    currentStepId: 'wfl-s3',
    startedAt: '2026-04-28T08:00:00Z',
  },
  {
    id: 'exe-2',
    wfId: 'wf-destruction',
    entityType: 'DESTRUCTION_REQUEST',
    entityId: 'dr-001',
    status: ExecutionStatus.Running,
    currentStepId: 'wfd-s2',
    startedAt: '2026-04-27T10:00:00Z',
  },
  {
    id: 'exe-3',
    wfId: 'wf-archiving',
    entityType: 'RECORD',
    entityId: 'rec-042',
    status: ExecutionStatus.Completed,
    currentStepId: undefined,
    startedAt: '2026-04-25T09:00:00Z',
    completedAt: '2026-04-26T14:30:00Z',
  },
];
