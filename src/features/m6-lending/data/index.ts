import { LendingStatus, type LendingRequest, type MessengerDispatch } from '../types';

export const lendingRequestsSeed: LendingRequest[] = [
  { id: 'lr1', requester: 'إدارة الشؤون القانونية', recordRef: 'REC-2026-00001', purpose: 'مراجعة عقد', dueDate: '2026-05-10', status: LendingStatus.Pending },
  { id: 'lr2', requester: 'الإدارة المالية', recordRef: 'REC-2026-00003', purpose: 'مطابقة تقرير', dueDate: '2026-05-05', status: LendingStatus.Active },
  { id: 'lr3', requester: 'المراجعة الداخلية', recordRef: 'REC-2026-00002', purpose: 'تدقيق', dueDate: '2026-04-20', status: LendingStatus.Overdue },
];

export const dispatchesSeed: MessengerDispatch[] = [
  { id: 'md1', requestId: 'lr2', direction: 'outbound', messengerName: 'سعد', createdAt: '2026-04-28T08:00:00Z' },
  { id: 'md2', requestId: 'lr2', direction: 'inbound', messengerName: 'سعد', createdAt: '2026-04-29T15:00:00Z' },
];
