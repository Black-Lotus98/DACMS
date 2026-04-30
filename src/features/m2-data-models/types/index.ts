export enum FieldType {
  Text = 'TEXT',
  Date = 'DATE',
  Number = 'NUMBER',
  Dropdown = 'DROPDOWN',
  MultiSelect = 'MULTI_SELECT',
  Checkbox = 'CHECKBOX',
}

export enum ActionAfter {
  Destroy = 'DESTROY',
  Migrate = 'MIGRATE',
  Review = 'REVIEW',
}

export interface OptionSet {
  id: string;
  nameAr: string;
  nameEn: string;
  options: string[];
}

export interface DocumentType {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface DocumentCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  docTypeId: string;
  parentId?: string;
  level: 1 | 2 | 3 | 4;
}

export interface MetadataField {
  id: string;
  fieldKey: string;
  labelAr: string;
  labelEn: string;
  fieldType: FieldType;
  isRequired: boolean;
  defaultVal?: string;
  optionSetId?: string;
  docTypeId: string;
}

export interface RetentionPolicy {
  id: string;
  docTypeId: string;
  periodYears: number;
  actionAfter: ActionAfter;
  legalRef?: string;
}

export interface DataModelsState {
  documentTypes: DocumentType[];
  categories: DocumentCategory[];
  metadataFields: MetadataField[];
  retentionPolicies: RetentionPolicy[];
  optionSets: OptionSet[];
}
