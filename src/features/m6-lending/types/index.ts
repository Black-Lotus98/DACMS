export enum LendingStatus { Pending='pending', Approved='approved', Active='active', Overdue='overdue', Returned='returned' }

export interface LendingRequest {
  id: string;
  requester: string;
  recordRef: string;
  purpose: string;
  dueDate: string;
  status: LendingStatus;
}

export interface MessengerDispatch {
  id: string;
  requestId: string;
  direction: 'outbound' | 'inbound';
  messengerName: string;
  createdAt: string;
}

export interface LendingState {
  requests: LendingRequest[];
  dispatches: MessengerDispatch[];
}
