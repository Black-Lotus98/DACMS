export enum LendingStatus {
  Pending    = 'PENDING',
  Approved   = 'APPROVED',
  Rejected   = 'REJECTED',
  Dispatched = 'DISPATCHED',
  Active     = 'ACTIVE',
  Returned   = 'RETURNED',
  Overdue    = 'OVERDUE',
}

export enum ItemStatus {
  Pending    = 'PENDING',
  Dispatched = 'DISPATCHED',
  Active     = 'ACTIVE',
  Returned   = 'RETURNED',
}

export enum DispatchDirection {
  Outbound = 'OUTBOUND',
  Inbound  = 'INBOUND',
}

export interface LendingRequest {
  id:               string;
  refNo:            string;
  requesterId:      string;
  deptId:           string;
  purpose:          string;
  status:           LendingStatus;
  requestedAt:      string;
  dueDate?:         string;
  approvedBy?:      string;
  approvedAt?:      string;
  returnedAt?:      string;
  rejectionReason?: string;
}

export interface LendingItem {
  id:        string;
  requestId: string;
  recordId:  string;
  status:    ItemStatus;
}

export interface MessengerDispatch {
  id:           string;
  requestId:    string;
  messengerId:  string;
  direction:    DispatchDirection;
  dispatchedAt: string;
  confirmedAt?: string;
}

export interface LendingState {
  requests:  LendingRequest[];
  items:     LendingItem[];
  dispatches: MessengerDispatch[];
}
