import {
  AssigneeType,
  ExecutionStatus,
  StepType,
  TriggerType,
  WorkflowStatus,
  WorkflowType,
  type Workflow,
  type WorkflowExecution,
} from '../types';
import { RoleType } from '@/config/roles';

// -----------------------------------------------------------
// F14.3 — Archive Intake
// Trigger → Data Entry → Document Review → Approve → Location Assignment
// -----------------------------------------------------------
const archivingWorkflow: Workflow = {
  id: 'wf-archiving', nameAr: 'سير أرشفة المستندات', nameEn: 'Archive Intake Workflow',
  type: WorkflowType.Archiving, status: WorkflowStatus.Published, version: 1, createdBy: 'system',
  steps: [
    { id: 'wfa-s1', stepType: StepType.Trigger,  nameAr: 'بدء الأرشفة',          nameEn: 'Start Intake',           triggerType: TriggerType.Auto, posX: 250, posY: 50  },
    { id: 'wfa-s2', stepType: StepType.Human,    nameAr: 'إدخال البيانات',        nameEn: 'Data Entry',             assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveOfficer,    slaHours: 8,  actions: ['Submit', 'Return'],          posX: 250, posY: 160 },
    { id: 'wfa-s3', stepType: StepType.Human,    nameAr: 'مراجعة الوثائق',        nameEn: 'Document Review',        assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveSupervisor, slaHours: 12, actions: ['Approve', 'Reject'],         posX: 250, posY: 270 },
    { id: 'wfa-s4', stepType: StepType.Human,    nameAr: 'اعتماد الأرشفة',        nameEn: 'Approve Archiving',      assigneeType: AssigneeType.Role, assigneeId: RoleType.CenterDirector,    slaHours: 24, actions: ['Approve', 'Reject'],         posX: 250, posY: 380 },
    { id: 'wfa-s5', stepType: StepType.Human,    nameAr: 'تعيين الموقع المادي',   nameEn: 'Location Assignment',    assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveOfficer,    slaHours: 4,  actions: ['Assign', 'Defer'],           posX: 250, posY: 490 },
  ],
  edges: [
    { id: 'wfa-e1', source: 'wfa-s1', target: 'wfa-s2' },
    { id: 'wfa-e2', source: 'wfa-s2', target: 'wfa-s3' },
    { id: 'wfa-e3', source: 'wfa-s3', target: 'wfa-s4' },
    { id: 'wfa-e4', source: 'wfa-s4', target: 'wfa-s5' },
  ],
};

// -----------------------------------------------------------
// F14.4 — Lending Request
// Trigger → Requester Input → Supervisor Approval → Dispatch → Return Confirmation
// -----------------------------------------------------------
const lendingWorkflow: Workflow = {
  id: 'wf-lending', nameAr: 'سير طلب الإعارة', nameEn: 'Lending Request Workflow',
  type: WorkflowType.Lending, status: WorkflowStatus.Published, version: 1, createdBy: 'system',
  steps: [
    { id: 'wfl-s1', stepType: StepType.Trigger, nameAr: 'بدء طلب الإعارة',  nameEn: 'Start Lending Request',    triggerType: TriggerType.Auto, posX: 250, posY: 50  },
    { id: 'wfl-s2', stepType: StepType.Human,   nameAr: 'بيانات الطلب',     nameEn: 'Requester Input',          assigneeType: AssigneeType.Department, assigneeId: 'dept-legal', slaHours: 4,  actions: ['Submit', 'Cancel'],       posX: 250, posY: 160 },
    { id: 'wfl-s3', stepType: StepType.Human,   nameAr: 'موافقة المشرف',    nameEn: 'Supervisor Approval',      assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveSupervisor, slaHours: 24, actions: ['Approve', 'Reject'], posX: 250, posY: 270 },
    { id: 'wfl-s4', stepType: StepType.Human,   nameAr: 'إرسال الوثيقة',    nameEn: 'Archive Officer Dispatch', assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveOfficer,    slaHours: 8,  actions: ['Dispatch', 'Hold'],       posX: 250, posY: 380 },
    { id: 'wfl-s5', stepType: StepType.Human,   nameAr: 'تأكيد الإعادة',    nameEn: 'Return Confirmation',      assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveOfficer,    slaHours: 4,  actions: ['Confirm Return'],         posX: 250, posY: 490 },
  ],
  edges: [
    { id: 'wfl-e1', source: 'wfl-s1', target: 'wfl-s2' },
    { id: 'wfl-e2', source: 'wfl-s2', target: 'wfl-s3' },
    { id: 'wfl-e3', source: 'wfl-s3', target: 'wfl-s4' },
    { id: 'wfl-e4', source: 'wfl-s4', target: 'wfl-s5' },
  ],
};

// -----------------------------------------------------------
// F14.5 — Destruction Approval (single rejection blocks — Decision nodes)
// -----------------------------------------------------------
const destructionWorkflow: Workflow = {
  id: 'wf-destruction', nameAr: 'سير اعتماد الإتلاف', nameEn: 'Destruction Approval Workflow',
  type: WorkflowType.Destruction, status: WorkflowStatus.Published, version: 1, createdBy: 'system',
  steps: [
    { id: 'wfd-s1',       stepType: StepType.Trigger,  nameAr: 'بدء طلب الإتلاف',     nameEn: 'Start Destruction Request', triggerType: TriggerType.Auto, posX: 250, posY: 50  },
    { id: 'wfd-s2',       stepType: StepType.Human,    nameAr: 'موافقة المشرف',        nameEn: 'Supervisor Approval',        assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveSupervisor, slaHours: 24, actions: ['Approve', 'Reject'], posX: 250, posY: 160 },
    { id: 'wfd-d1',       stepType: StepType.Decision, nameAr: 'قرار المشرف',          nameEn: 'Supervisor Decision',        posX: 250, posY: 270 },
    { id: 'wfd-s3',       stepType: StepType.Human,    nameAr: 'المراجعة القانونية',   nameEn: 'Legal Review',               assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveSupervisor, slaHours: 48, actions: ['Approve', 'Reject'], posX: 250, posY: 380 },
    { id: 'wfd-d2',       stepType: StepType.Decision, nameAr: 'القرار القانوني',      nameEn: 'Legal Decision',             posX: 250, posY: 490 },
    { id: 'wfd-s4',       stepType: StepType.Human,    nameAr: 'اعتماد المدير',        nameEn: 'Director Approval',          assigneeType: AssigneeType.Role, assigneeId: RoleType.CenterDirector, slaHours: 48, actions: ['Approve', 'Reject'],    posX: 250, posY: 600 },
    { id: 'wfd-d3',       stepType: StepType.Decision, nameAr: 'قرار المدير',          nameEn: 'Director Decision',          posX: 250, posY: 710 },
    { id: 'wfd-s5',       stepType: StepType.System,   nameAr: 'تنفيذ الإتلاف',        nameEn: 'Execute Destruction',        posX: 250, posY: 820 },
    { id: 'wfd-rejected', stepType: StepType.System,   nameAr: 'رفض الطلب',            nameEn: 'Request Rejected',           posX: 550, posY: 490 },
  ],
  edges: [
    { id: 'wfd-e1',  source: 'wfd-s1',       target: 'wfd-s2'       },
    { id: 'wfd-e2',  source: 'wfd-s2',       target: 'wfd-d1'       },
    { id: 'wfd-e3',  source: 'wfd-d1',       target: 'wfd-s3',       label: 'Approved' },
    { id: 'wfd-e4',  source: 'wfd-d1',       target: 'wfd-rejected', label: 'Rejected' },
    { id: 'wfd-e5',  source: 'wfd-s3',       target: 'wfd-d2'       },
    { id: 'wfd-e6',  source: 'wfd-d2',       target: 'wfd-s4',       label: 'Approved' },
    { id: 'wfd-e7',  source: 'wfd-d2',       target: 'wfd-rejected', label: 'Rejected' },
    { id: 'wfd-e8',  source: 'wfd-s4',       target: 'wfd-d3'       },
    { id: 'wfd-e9',  source: 'wfd-d3',       target: 'wfd-s5',       label: 'Approved' },
    { id: 'wfd-e10', source: 'wfd-d3',       target: 'wfd-rejected', label: 'Rejected' },
  ],
};

// -----------------------------------------------------------
// F14.6 — Migration Request
// -----------------------------------------------------------
const migrationWorkflow: Workflow = {
  id: 'wf-migration', nameAr: 'سير طلب الترحيل', nameEn: 'Migration Request Workflow',
  type: WorkflowType.Migration, status: WorkflowStatus.Published, version: 1, createdBy: 'system',
  steps: [
    { id: 'wfm-s1', stepType: StepType.Trigger, nameAr: 'بدء طلب الترحيل', nameEn: 'Start Migration Request', triggerType: TriggerType.Auto, posX: 250, posY: 50  },
    { id: 'wfm-s2', stepType: StepType.Human,   nameAr: 'موافقة المشرف',   nameEn: 'Supervisor Approval',     assigneeType: AssigneeType.Role, assigneeId: RoleType.ArchiveSupervisor, slaHours: 24, actions: ['Approve', 'Reject'], posX: 250, posY: 160 },
    { id: 'wfm-s3', stepType: StepType.Human,   nameAr: 'اعتماد المدير',   nameEn: 'Director Approval',       assigneeType: AssigneeType.Role, assigneeId: RoleType.CenterDirector,    slaHours: 48, actions: ['Approve', 'Reject'], posX: 250, posY: 270 },
    { id: 'wfm-s4', stepType: StepType.System,  nameAr: 'التنفيذ التقني',  nameEn: 'Technical Execution',     posX: 250, posY: 380 },
  ],
  edges: [
    { id: 'wfm-e1', source: 'wfm-s1', target: 'wfm-s2' },
    { id: 'wfm-e2', source: 'wfm-s2', target: 'wfm-s3' },
    { id: 'wfm-e3', source: 'wfm-s3', target: 'wfm-s4' },
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
    id: 'exe-1', wfId: 'wf-lending', entityType: 'LENDING_REQUEST', entityId: 'lr1',
    status: ExecutionStatus.Running, currentStepId: 'wfl-s3',
    startedAt: '2026-04-28T08:00:00Z', currentStepStartedAt: '2026-04-28T10:00:00Z',
    actionHistory: [
      { stepId: 'wfl-s2', action: 'Submit', actorId: 'mock-beneficiary', takenAt: '2026-04-28T10:00:00Z' },
    ],
  },
  {
    id: 'exe-2', wfId: 'wf-destruction', entityType: 'DESTRUCTION_REQUEST', entityId: 'dr1',
    status: ExecutionStatus.Running, currentStepId: 'wfd-s2',
    startedAt: '2026-04-27T10:00:00Z', currentStepStartedAt: '2026-04-27T10:00:00Z',
    actionHistory: [],
  },
  {
    id: 'exe-3', wfId: 'wf-archiving', entityType: 'RECORD', entityId: 'rec1',
    status: ExecutionStatus.Completed,
    startedAt: '2026-04-25T09:00:00Z', completedAt: '2026-04-26T14:30:00Z',
    actionHistory: [
      { stepId: 'wfa-s2', action: 'Submit',  actorId: 'mock-archive-officer',    takenAt: '2026-04-25T11:00:00Z' },
      { stepId: 'wfa-s3', action: 'Approve', actorId: 'mock-archive-supervisor', takenAt: '2026-04-25T15:00:00Z' },
      { stepId: 'wfa-s4', action: 'Approve', actorId: 'mock-center-director',    takenAt: '2026-04-26T09:00:00Z' },
      { stepId: 'wfa-s5', action: 'Assign',  actorId: 'mock-archive-officer',    takenAt: '2026-04-26T14:30:00Z' },
    ],
  },
];
