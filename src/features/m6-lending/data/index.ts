import {
  DispatchDirection, ItemStatus, LendingStatus,
  type LendingItem, type LendingRequest, type MessengerDispatch,
} from '../types';

export const lendingRequestsSeed: LendingRequest[] = [
  {
    id:          'lr1',
    refNo:       'LND-2026-00001',
    requesterId: 'user3',
    deptId:      'dept-legal',
    purpose:     'Contract review for legal proceedings',
    status:      LendingStatus.Pending,
    requestedAt: '2026-04-25T09:00:00Z',
    dueDate:     '2026-05-10',
  },
  {
    id:          'lr2',
    refNo:       'LND-2026-00002',
    requesterId: 'user4',
    deptId:      'dept-finance',
    purpose:     'Quarterly financial reconciliation',
    status:      LendingStatus.Active,
    requestedAt: '2026-04-20T10:00:00Z',
    dueDate:     '2026-05-05',
    approvedBy:  'user2',
    approvedAt:  '2026-04-21T08:00:00Z',
  },
  {
    id:          'lr3',
    refNo:       'LND-2026-00003',
    requesterId: 'user5',
    deptId:      'dept-audit',
    purpose:     'Internal audit review',
    status:      LendingStatus.Overdue,
    requestedAt: '2026-04-01T11:00:00Z',
    dueDate:     '2026-04-20',
    approvedBy:  'user2',
    approvedAt:  '2026-04-02T09:00:00Z',
  },
  {
    id:          'lr4',
    refNo:       'LND-2026-00004',
    requesterId: 'user3',
    deptId:      'dept-legal',
    purpose:     'Policy verification',
    status:      LendingStatus.Rejected,
    requestedAt: '2026-04-15T08:00:00Z',
    rejectionReason: 'Record under active destruction review.',
  },
];

export const lendingItemsSeed: LendingItem[] = [
  { id: 'li1', requestId: 'lr1', recordId: 'rec1', status: ItemStatus.Pending },
  { id: 'li2', requestId: 'lr2', recordId: 'rec3', status: ItemStatus.Active },
  { id: 'li3', requestId: 'lr3', recordId: 'rec2', status: ItemStatus.Active },
  { id: 'li4', requestId: 'lr4', recordId: 'rec1', status: ItemStatus.Pending },
];

export const dispatchesSeed: MessengerDispatch[] = [
  {
    id:           'md1',
    requestId:    'lr2',
    messengerId:  'messenger1',
    direction:    DispatchDirection.Outbound,
    dispatchedAt: '2026-04-22T08:00:00Z',
    confirmedAt:  '2026-04-22T10:30:00Z',
  },
  {
    id:           'md2',
    requestId:    'lr2',
    messengerId:  'messenger1',
    direction:    DispatchDirection.Inbound,
    dispatchedAt: '2026-05-04T14:00:00Z',
  },
];
