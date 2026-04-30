export enum KpiUnit {
  Percent = '%',
  Count   = 'count',
  Days    = 'days',
}

export enum KpiGroup {
  Operational = 'OPERATIONAL',
  Lending     = 'LENDING',
  Storage     = 'STORAGE',
  Destruction = 'DESTRUCTION',
  Governance  = 'GOVERNANCE',
}

export enum KpiTrend {
  Up     = 'UP',
  Down   = 'DOWN',
  Stable = 'STABLE',
}

export interface KPIDefinition {
  id:             string;
  key:            string;
  nameAr:         string;
  nameEn:         string;
  formula:        string;
  targetValue?:   number;
  unit:           KpiUnit;
  group:          KpiGroup;
  roleScope:      string[];
  higherIsBetter: boolean;
}

export interface KPISnapshot {
  id:         string;
  kpiId:      string;
  value:      number;
  period:     string;
  computedAt: string;
}

export interface KpiState {
  definitions: KPIDefinition[];
  snapshots:   KPISnapshot[];
}
