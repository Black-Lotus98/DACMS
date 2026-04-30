import type { KpiMapping } from '../types';
export const mappingsSeed: KpiMapping[] = [
  {
    id: 'm1',
    role: 'center_director',
    kpiKeys: ['policy_compliance_rate', 'overdue_count', 'lending_request_count', 'destruction_pending_count'],
    displayOrder: ['policy_compliance_rate', 'overdue_count', 'lending_request_count', 'destruction_pending_count'],
    primaryKpiKey: 'policy_compliance_rate',
  },
  {
    id: 'm2',
    role: 'archive_supervisor',
    kpiKeys: ['avg_processing_time', 'overdue_rate', 'storage_capacity_used', 'destruction_pending_count'],
    displayOrder: ['avg_processing_time', 'overdue_rate', 'storage_capacity_used', 'destruction_pending_count'],
    primaryKpiKey: 'avg_processing_time',
  },
  {
    id: 'm3',
    role: 'archive_officer',
    kpiKeys: ['avg_processing_time', 'records_digitized_rate', 'overdue_rate', 'lending_request_count'],
    displayOrder: ['avg_processing_time', 'records_digitized_rate', 'overdue_rate', 'lending_request_count'],
    primaryKpiKey: 'avg_processing_time',
  },
  {
    id: 'm4',
    role: 'admin',
    kpiKeys: ['user_activity_rate', 'policy_compliance_rate', 'overdue_count', 'avg_processing_time'],
    displayOrder: ['user_activity_rate', 'policy_compliance_rate', 'overdue_count', 'avg_processing_time'],
    primaryKpiKey: 'user_activity_rate',
  },
  {
    id: 'm5',
    role: 'beneficiary',
    kpiKeys: [],
    displayOrder: [],
  },
];
