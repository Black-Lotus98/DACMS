export interface KPIValue { id: string; key: string; label: string; value: number; trend: number; roleScope: string[] }
export interface KPIState { definitions: KPIValue[] }
