export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Select = 'select',
  Boolean = 'boolean',
}

export enum ActionAfter {
  Destroy = 'destroy',
  Transfer = 'transfer',
  Review = 'review',
}

export interface DocumentType {
  id: string;
  name: string;
  code: string;
  retentionPolicyId: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  parentId?: string;
  docTypeId: string;
  level: 1 | 2 | 3 | 4;
}

export interface MetadataField {
  id: string;
  label: string;
  fieldType: FieldType;
  required: boolean;
  docTypeId: string;
  options?: string[];
}

export interface RetentionPolicy {
  id: string;
  name: string;
  periodYears: number;
  actionAfter: ActionAfter;
}

export interface DataModelsState {
  documentTypes: DocumentType[];
  categories: DocumentCategory[];
  metadataFields: MetadataField[];
  retentionPolicies: RetentionPolicy[];
}
