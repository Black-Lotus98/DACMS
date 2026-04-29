import type { KPIValue } from '../types';
export const kpiSeed: KPIValue[] = [
  { id: 'kpi1', key: 'archive_occupancy', label: 'معدل إشغال الأرشيف', value: 76, trend: 3, roleScope: ['center_director','archive_supervisor'] },
  { id: 'kpi2', key: 'avg_lending_time', label: 'متوسط زمن الإعارة', value: 4, trend: -1, roleScope: ['archive_supervisor'] },
  { id: 'kpi3', key: 'overdue_count', label: 'عدد الطلبات المتأخرة', value: 9, trend: 2, roleScope: ['center_director','admin'] },
];
