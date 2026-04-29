export interface ReportDefinition { id: string; name: string; category: string }
export interface ReportState { definitions: ReportDefinition[]; activeReportId: string | null }
