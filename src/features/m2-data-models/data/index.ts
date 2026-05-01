import { ActionAfter, FieldType } from '../types';
import type { BoxTemplate, DocumentCategory, DocumentType, MetadataField, OptionSet, RetentionPolicy, ShelfTemplate } from '../types';

export const optionSetsSeed: OptionSet[] = [
  { id: 'os1', nameAr: 'مستوى السرية', nameEn: 'Secrecy Level', options: ['عام', 'داخلي', 'سري', 'سري للغاية'] },
  { id: 'os2', nameAr: 'نوع الخدمة', nameEn: 'Service Type', options: ['License', 'Registration', 'Inquiry', 'Complaint'] },
  { id: 'os3', nameAr: 'حالة العقد', nameEn: 'Contract Status', options: ['Active', 'Expired', 'Terminated'] },
];

export const documentTypesSeed: DocumentType[] = [
  { id: 'dt1', nameAr: 'المراسلات الرسمية',    nameEn: 'Official Correspondence',   code: 'CORR', isActive: true },
  { id: 'dt2', nameAr: 'العقود والاتفاقيات',    nameEn: 'Contracts & Agreements',    code: 'CONT', isActive: true },
  { id: 'dt3', nameAr: 'التقارير المالية',       nameEn: 'Financial Reports',         code: 'FINR', isActive: true },
  { id: 'dt4', nameAr: 'القرارات الإدارية',      nameEn: 'Administrative Decisions',  code: 'ADMD', isActive: true },
  { id: 'dt5', nameAr: 'طلبات الخدمة',           nameEn: 'Service Requests',          code: 'SREQ', isActive: true },
];

export const retentionPoliciesSeed: RetentionPolicy[] = [
  { id: 'rp1', docTypeId: 'dt3', periodYears: 5,  actionAfter: ActionAfter.Destroy, legalRef: 'MOT-RET-2025 §3.1' },
  { id: 'rp2', docTypeId: 'dt1', periodYears: 10, actionAfter: ActionAfter.Review  },
  { id: 'rp3', docTypeId: 'dt2', periodYears: 25, actionAfter: ActionAfter.Migrate, legalRef: 'MOT-RET-2025 §5.2' },
  { id: 'rp4', docTypeId: 'dt5', periodYears: 7,  actionAfter: ActionAfter.Destroy },
  { id: 'rp5', docTypeId: 'dt4', periodYears: 99, actionAfter: ActionAfter.Review  },
];

export const categoriesSeed: DocumentCategory[] = [
  // dt1 — Official Correspondence
  { id: 'c1', nameAr: 'مراسلات صادرة',    nameEn: 'Outgoing Correspondence', code: 'CORR-OUT', docTypeId: 'dt1', level: 1 },
  { id: 'c2', nameAr: 'مراسلات واردة',    nameEn: 'Incoming Correspondence', code: 'CORR-IN',  docTypeId: 'dt1', level: 1 },
  { id: 'c3', nameAr: 'رسمية',            nameEn: 'Official',                code: 'CORR-OUT-OF', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  { id: 'c4', nameAr: 'سرية',             nameEn: 'Confidential',            code: 'CORR-OUT-CF', docTypeId: 'dt1', parentId: 'c1', level: 2 },
  // dt2 — Contracts
  { id: 'c5', nameAr: 'عقود داخلية',      nameEn: 'Internal Contracts',      code: 'CONT-INT', docTypeId: 'dt2', level: 1 },
  { id: 'c6', nameAr: 'عقود خارجية',      nameEn: 'External Contracts',      code: 'CONT-EXT', docTypeId: 'dt2', level: 1 },
  { id: 'c7', nameAr: 'عقود صيانة',       nameEn: 'Maintenance Contracts',   code: 'CONT-INT-MT', docTypeId: 'dt2', parentId: 'c5', level: 2 },
  // dt3 — Financial Reports
  { id: 'c8', nameAr: 'تقارير ربع سنوية', nameEn: 'Quarterly Reports',       code: 'FINR-Q',  docTypeId: 'dt3', level: 1 },
  { id: 'c9', nameAr: 'تقارير سنوية',     nameEn: 'Annual Reports',          code: 'FINR-A',  docTypeId: 'dt3', level: 1 },
];

export const metadataFieldsSeed: MetadataField[] = [
  // dt1
  { id: 'mf1',  fieldKey: 'ref_number',     labelAr: 'رقم المرجع',         labelEn: 'Reference Number',      fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt1' },
  { id: 'mf2',  fieldKey: 'issue_date',     labelAr: 'تاريخ الإصدار',      labelEn: 'Issue Date',            fieldType: FieldType.Date,        isRequired: true,  docTypeId: 'dt1' },
  { id: 'mf3',  fieldKey: 'secrecy_level',  labelAr: 'مستوى السرية',       labelEn: 'Secrecy Level',         fieldType: FieldType.Dropdown,    isRequired: true,  docTypeId: 'dt1', optionSetId: 'os1' },
  { id: 'mf4',  fieldKey: 'sender_dept',    labelAr: 'الجهة المرسلة',      labelEn: 'Sender Department',     fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt1' },
  // dt2
  { id: 'mf5',  fieldKey: 'contract_no',    labelAr: 'رقم العقد',          labelEn: 'Contract Number',       fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt2' },
  { id: 'mf6',  fieldKey: 'start_date',     labelAr: 'تاريخ البداية',      labelEn: 'Contract Start Date',   fieldType: FieldType.Date,        isRequired: true,  docTypeId: 'dt2' },
  { id: 'mf7',  fieldKey: 'end_date',       labelAr: 'تاريخ الانتهاء',     labelEn: 'Contract End Date',     fieldType: FieldType.Date,        isRequired: true,  docTypeId: 'dt2' },
  { id: 'mf8',  fieldKey: 'contract_value', labelAr: 'قيمة العقد',         labelEn: 'Contract Value',        fieldType: FieldType.Number,      isRequired: false, docTypeId: 'dt2' },
  { id: 'mf9',  fieldKey: 'status',         labelAr: 'حالة العقد',         labelEn: 'Contract Status',       fieldType: FieldType.Dropdown,    isRequired: true,  docTypeId: 'dt2', optionSetId: 'os3' },
  // dt3
  { id: 'mf10', fieldKey: 'fiscal_year',    labelAr: 'السنة المالية',      labelEn: 'Fiscal Year',           fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt3' },
  { id: 'mf11', fieldKey: 'dept',           labelAr: 'الجهة المسؤولة',     labelEn: 'Responsible Dept',      fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt3' },
  // dt4
  { id: 'mf12', fieldKey: 'decision_no',    labelAr: 'رقم القرار',         labelEn: 'Decision Number',       fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt4' },
  { id: 'mf13', fieldKey: 'decision_date',  labelAr: 'تاريخ القرار',       labelEn: 'Decision Date',         fieldType: FieldType.Date,        isRequired: true,  docTypeId: 'dt4' },
  // dt5
  { id: 'mf14', fieldKey: 'service_type',   labelAr: 'نوع الخدمة',         labelEn: 'Service Type',          fieldType: FieldType.Dropdown,    isRequired: true,  docTypeId: 'dt5', optionSetId: 'os2' },
  { id: 'mf15', fieldKey: 'applicant_name', labelAr: 'اسم مقدم الطلب',    labelEn: 'Applicant Name',        fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt5' },
  { id: 'mf16', fieldKey: 'id_number',      labelAr: 'رقم الهوية',         labelEn: 'ID Number',             fieldType: FieldType.Text,        isRequired: true,  docTypeId: 'dt5' },
];

export const boxTemplatesSeed: BoxTemplate[] = [
  { id: 'bt1', nameAr: 'صندوق قياسي أ', nameEn: 'Standard Box A', code: 'BOX-A', widthCm: 40, heightCm: 30, depthCm: 25, maxDocs: 500 },
  { id: 'bt2', nameAr: 'صندوق قياسي ب', nameEn: 'Standard Box B', code: 'BOX-B', widthCm: 35, heightCm: 25, depthCm: 20, maxDocs: 350, description: 'For A4 documents only' },
  { id: 'bt3', nameAr: 'صندوق الأرشيف الكبير', nameEn: 'Large Archive Box', code: 'BOX-L', widthCm: 60, heightCm: 40, depthCm: 30, maxDocs: 1000 },
];

export const shelfTemplatesSeed: ShelfTemplate[] = [
  { id: 'st1', nameAr: 'رف قياسي', nameEn: 'Standard Shelf', code: 'SHELF-STD', slots: 10, boxTemplateId: 'bt1' },
  { id: 'st2', nameAr: 'رف مزدوج', nameEn: 'Double Shelf', code: 'SHELF-DBL', slots: 20, boxTemplateId: 'bt2' },
  { id: 'st3', nameAr: 'رف الأرشيف الثقيل', nameEn: 'Heavy Archive Shelf', code: 'SHELF-HVY', slots: 6, boxTemplateId: 'bt3', description: 'Reinforced for heavy boxes' },
];
