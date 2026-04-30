export enum WebhookEventType {
  RecordCreated         = 'record.created',
  RecordStatusChanged   = 'record.status_changed',
  LendingApproved       = 'lending.approved',
  LendingOverdue        = 'lending.overdue',
  DestructionExecuted   = 'destruction.executed',
  WorkflowCompleted     = 'workflow.completed',
  ApprovalCompleted     = 'approval.completed',
}

export enum ConnectorType {
  AdminComms = 'ADMIN_COMMS',
  DMS        = 'DMS',
}

export enum ConnectorStatus {
  Active   = 'ACTIVE',
  Inactive = 'INACTIVE',
  Error    = 'ERROR',
}

export enum SystemStatus {
  Connected    = 'connected',
  Degraded     = 'degraded',
  Disconnected = 'disconnected',
}

export interface APIKey {
  id:          string;
  name:        string;
  keyHash:     string;
  permissions: string[];
  isActive:    boolean;
  expiresAt?:  string;
  createdAt:   string;
  lastUsed?:   string;
}

export interface WebhookConfig {
  id:               string;
  name:             string;
  url:              string;
  eventType:        WebhookEventType;
  secret?:          string;
  isActive:         boolean;
  createdAt:        string;
  lastTriggeredAt?: string;
}

export interface IntegrationConnector {
  id:           string;
  name:         string;
  type:         ConnectorType;
  status:       ConnectorStatus;
  endpoint:     string;
  description?: string;
}

export interface SmtpConfig {
  host:        string;
  port:        number;
  username:    string;
  useTls:      boolean;
  fromAddress: string;
  fromName:    string;
}

export interface LdapConfig {
  host:            string;
  port:            number;
  baseDn:          string;
  bindDn:          string;
  isEnabled:       boolean;
  fallbackToLocal: boolean;
}

export interface IntegrationState {
  apiKeys:    APIKey[];
  webhooks:   WebhookConfig[];
  connectors: IntegrationConnector[];
  smtpConfig: SmtpConfig;
  ldapConfig: LdapConfig;
  status:     SystemStatus;
}
