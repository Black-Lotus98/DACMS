export enum ReportType {
  Transfers    = 'TRANSFERS',
  Lending      = 'LENDING',
  Destruction  = 'DESTRUCTION',
  Inventory    = 'INVENTORY',
  UserActivity = 'USER_ACTIVITY',
  Capacity     = 'CAPACITY',
  Overdue      = 'OVERDUE',
  Expiry       = 'EXPIRY',
  Custom       = 'CUSTOM',
}

export enum ExportFormat {
  PDF   = 'PDF',
  Excel = 'EXCEL',
}

export interface ReportFilters {
  dateFrom?:     string;
  dateTo?:       string;
  departmentId?: string;
  docTypeId?:    string;
  roomId?:       string;
  officerId?:    string;
  status?:       string;
}

export interface ReportSchedule {
  cron:       string;
  recipients: string[];
}

export interface ReportDefinition {
  id:          string;
  nameAr:      string;
  nameEn:      string;
  type:        ReportType;
  createdBy:   string;
  filters:     ReportFilters;
  schedule?:   ReportSchedule;
  recipients?: string[];
}

export interface ReportsState {
  definitions:    ReportDefinition[];
  activeReportId: string | null;
}
