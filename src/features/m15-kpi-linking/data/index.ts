import type { KpiMapping } from '../types';
export const mappingsSeed: KpiMapping[] = [
  { id: 'm1', role: 'center_director', kpiKeys: ['archive_occupancy','overdue_count'] },
  { id: 'm2', role: 'archive_supervisor', kpiKeys: ['archive_occupancy','avg_lending_time'] },
  { id: 'm3', role: 'admin', kpiKeys: ['overdue_count'] },
];
