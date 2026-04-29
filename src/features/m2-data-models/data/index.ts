import { ActionAfter, FieldType } from '../types';
import type { DocumentCategory, DocumentType, MetadataField, RetentionPolicy } from '../types';

export const retentionPoliciesSeed: RetentionPolicy[] = [
  { id: 'rp1', name: 'سياسة 5 سنوات — Destroy', periodYears: 5, actionAfter: ActionAfter.Destroy },
  { id: 'rp2', name: '10-Year Policy — Review', periodYears: 10, actionAfter: ActionAfter.Review },
  { id: 'rp3', name: '25-Year Policy — Transfer', periodYears: 25, actionAfter: ActionAfter.Transfer },
  { id: 'rp4', name: 'سياسة 7 سنوات — Destroy', periodYears: 7, actionAfter: ActionAfter.Destroy },
  { id: 'rp5', name: 'Save دائم', periodYears: 99, actionAfter: ActionAfter.Review },
];

export const documentTypesSeed: DocumentType[] = [
  { id: 'dt1', name: 'مراسلات Official', code: 'CORR', retentionPolicyId: 'rp2' },
  { id: 'dt2', name: 'Contracts & Agreements', code: 'CONT', retentionPolicyId: 'rp3' },
  { id: 'dt3', name: 'Financial Reports', code: 'FINR', retentionPolicyId: 'rp1' },
  { id: 'dt4', name: 'Administrative Decisions', code: 'ADMD', retentionPolicyId: 'rp5' },
  { id: 'dt5', name: 'Service Requests', code: 'SREQ', retentionPolicyId: 'rp4' },
];

export const categoriesSeed: DocumentCategory[] = [
  // dt1 tree
  { id: 'c1', name: 'Outgoing Correspondence', docTypeId: 'dt1', level: 1 },
  { id: 'c2', name: 'Incoming Correspondence', docTypeId: 'dt1', level: 1 },
  { id: 'c3', name: 'Official', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  { id: 'c4', name: 'Confidential', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  // dt2 tree
  { id: 'c5', name: 'Internal Contracts', docTypeId: 'dt2', level: 1 },
  { id: 'c6', name: 'External Contracts', docTypeId: 'dt2', level: 1 },
  { id: 'c7', name: 'Maintenance Contracts', docTypeId: 'dt2', parentId: 'c5', level: 2 },
  // dt3 tree
  { id: 'c8', name: 'Quarterly Reports', docTypeId: 'dt3', level: 1 },
  { id: 'c9', name: 'Annual Reports', docTypeId: 'dt3', level: 1 },
];

export const metadataFieldsSeed: MetadataField[] = [
  { id: 'mf1', label: 'رقم Reference', fieldType: FieldType.Text, required: true, docTypeId: 'dt1' },
  { id: 'mf2', label: 'Issue Date', fieldType: FieldType.Date, required: true, docTypeId: 'dt1' },
  { id: 'mf3', label: 'مستوى Secrecy', fieldType: FieldType.Select, required: true, docTypeId: 'dt1', options: ['عام', 'سري', 'سري للغاية'] },
  { id: 'mf4', label: 'Department المرسلة', fieldType: FieldType.Text, required: true, docTypeId: 'dt1' },
  { id: 'mf5', label: 'Contract Number', fieldType: FieldType.Text, required: true, docTypeId: 'dt2' },
  { id: 'mf6', label: 'Contract Start Date', fieldType: FieldType.Date, required: true, docTypeId: 'dt2' },
  { id: 'mf7', label: 'Contract End Date', fieldType: FieldType.Date, required: true, docTypeId: 'dt2' },
  { id: 'mf8', label: 'Contract Value', fieldType: FieldType.Number, required: false, docTypeId: 'dt2' },
  { id: 'mf9', label: 'Fiscal Year', fieldType: FieldType.Text, required: true, docTypeId: 'dt3' },
  { id: 'mf10', label: 'Responsible Department', fieldType: FieldType.Text, required: true, docTypeId: 'dt3' },
  { id: 'mf11', label: 'Decision Number', fieldType: FieldType.Text, required: true, docTypeId: 'dt4' },
  { id: 'mf12', label: 'Decision Date', fieldType: FieldType.Date, required: true, docTypeId: 'dt4' },
  { id: 'mf13', label: 'Service Type', fieldType: FieldType.Select, required: true, docTypeId: 'dt5', options: ['License', 'Registration', 'Inquiry'] },
  { id: 'mf14', label: 'Applicant Name', fieldType: FieldType.Text, required: true, docTypeId: 'dt5' },
  { id: 'mf15', label: 'ID Number', fieldType: FieldType.Text, required: true, docTypeId: 'dt5' },
];
