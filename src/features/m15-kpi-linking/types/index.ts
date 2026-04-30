export interface KpiMapping {
  id: string;
  role: string;
  kpiKeys: string[];
  displayOrder?: string[];
  primaryKpiKey?: string;
}
export interface KpiLinkingState { mappings: KpiMapping[] }
