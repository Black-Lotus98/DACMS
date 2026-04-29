import { ActionAfter, FieldType } from '../types';
import type { DocumentCategory, DocumentType, MetadataField, RetentionPolicy } from '../types';

export const retentionPoliciesSeed: RetentionPolicy[] = [
  { id: 'rp1', name: 'سياسة 5 سنوات — إتلاف', periodYears: 5, actionAfter: ActionAfter.Destroy },
  { id: 'rp2', name: 'سياسة 10 سنوات — مراجعة', periodYears: 10, actionAfter: ActionAfter.Review },
  { id: 'rp3', name: 'سياسة 25 سنوات — نقل', periodYears: 25, actionAfter: ActionAfter.Transfer },
  { id: 'rp4', name: 'سياسة 7 سنوات — إتلاف', periodYears: 7, actionAfter: ActionAfter.Destroy },
  { id: 'rp5', name: 'حفظ دائم', periodYears: 99, actionAfter: ActionAfter.Review },
];

export const documentTypesSeed: DocumentType[] = [
  { id: 'dt1', name: 'مراسلات رسمية', code: 'CORR', retentionPolicyId: 'rp2' },
  { id: 'dt2', name: 'عقود وإتفاقيات', code: 'CONT', retentionPolicyId: 'rp3' },
  { id: 'dt3', name: 'تقارير مالية', code: 'FINR', retentionPolicyId: 'rp1' },
  { id: 'dt4', name: 'قرارات إدارية', code: 'ADMD', retentionPolicyId: 'rp5' },
  { id: 'dt5', name: 'طلبات خدمية', code: 'SREQ', retentionPolicyId: 'rp4' },
];

export const categoriesSeed: DocumentCategory[] = [
  // dt1 tree
  { id: 'c1', name: 'مراسلات صادرة', docTypeId: 'dt1', level: 1 },
  { id: 'c2', name: 'مراسلات واردة', docTypeId: 'dt1', level: 1 },
  { id: 'c3', name: 'رسمية', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  { id: 'c4', name: 'سرية', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  // dt2 tree
  { id: 'c5', name: 'عقود داخلية', docTypeId: 'dt2', level: 1 },
  { id: 'c6', name: 'عقود خارجية', docTypeId: 'dt2', level: 1 },
  { id: 'c7', name: 'عقود صيانة', docTypeId: 'dt2', parentId: 'c5', level: 2 },
  // dt3 tree
  { id: 'c8', name: 'تقارير ربع سنوية', docTypeId: 'dt3', level: 1 },
  { id: 'c9', name: 'تقارير سنوية', docTypeId: 'dt3', level: 1 },
];

export const metadataFieldsSeed: MetadataField[] = [
  { id: 'mf1', label: 'رقم المرجع', fieldType: FieldType.Text, required: true, docTypeId: 'dt1' },
  { id: 'mf2', label: 'تاريخ الإصدار', fieldType: FieldType.Date, required: true, docTypeId: 'dt1' },
  { id: 'mf3', label: 'مستوى السرية', fieldType: FieldType.Select, required: true, docTypeId: 'dt1', options: ['عام', 'سري', 'سري للغاية'] },
  { id: 'mf4', label: 'الجهة المرسلة', fieldType: FieldType.Text, required: true, docTypeId: 'dt1' },
  { id: 'mf5', label: 'رقم العقد', fieldType: FieldType.Text, required: true, docTypeId: 'dt2' },
  { id: 'mf6', label: 'تاريخ بداية العقد', fieldType: FieldType.Date, required: true, docTypeId: 'dt2' },
  { id: 'mf7', label: 'تاريخ انتهاء العقد', fieldType: FieldType.Date, required: true, docTypeId: 'dt2' },
  { id: 'mf8', label: 'قيمة العقد', fieldType: FieldType.Number, required: false, docTypeId: 'dt2' },
  { id: 'mf9', label: 'السنة المالية', fieldType: FieldType.Text, required: true, docTypeId: 'dt3' },
  { id: 'mf10', label: 'الإدارة المعنية', fieldType: FieldType.Text, required: true, docTypeId: 'dt3' },
  { id: 'mf11', label: 'رقم القرار', fieldType: FieldType.Text, required: true, docTypeId: 'dt4' },
  { id: 'mf12', label: 'تاريخ القرار', fieldType: FieldType.Date, required: true, docTypeId: 'dt4' },
  { id: 'mf13', label: 'نوع الخدمة', fieldType: FieldType.Select, required: true, docTypeId: 'dt5', options: ['ترخيص', 'تسجيل', 'استفسار'] },
  { id: 'mf14', label: 'اسم مقدم الطلب', fieldType: FieldType.Text, required: true, docTypeId: 'dt5' },
  { id: 'mf15', label: 'رقم الهوية', fieldType: FieldType.Text, required: true, docTypeId: 'dt5' },
];
