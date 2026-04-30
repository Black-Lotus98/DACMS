import {
  ConnectorStatus, ConnectorType, SystemStatus, WebhookEventType,
  type APIKey, type IntegrationConnector, type LdapConfig, type SmtpConfig, type WebhookConfig,
} from '../types';

export const apiKeysSeed: APIKey[] = [
  {
    id: 'k1',
    name: 'ERP Integration',
    keyHash: 'sha256$a3f1c2e9d4b8...',
    permissions: ['records.read', 'records.create', 'search.basic'],
    isActive: true,
    expiresAt: '2027-01-01',
    createdAt: '2026-01-15T08:00:00Z',
    lastUsed: '2026-04-29T14:22:00Z',
  },
  {
    id: 'k2',
    name: 'Reporting Client',
    keyHash: 'sha256$b7d2a4f1e6c3...',
    permissions: ['reports.view', 'reports.export'],
    isActive: true,
    expiresAt: '2026-12-31',
    createdAt: '2026-02-01T09:00:00Z',
    lastUsed: '2026-04-27T10:05:00Z',
  },
  {
    id: 'k3',
    name: 'Admin Comms Connector',
    keyHash: 'sha256$c9e3b5d2a8f4...',
    permissions: ['records.create', 'records.read'],
    isActive: true,
    createdAt: '2026-03-10T11:00:00Z',
  },
];

export const webhooksSeed: WebhookConfig[] = [
  {
    id: 'w1',
    name: 'Archive Event Listener',
    url: 'https://erp.internal/hooks/archive',
    eventType: WebhookEventType.RecordCreated,
    secret: 'whsec_abc123',
    isActive: true,
    createdAt: '2026-01-20T08:00:00Z',
    lastTriggeredAt: '2026-04-29T15:00:00Z',
  },
  {
    id: 'w2',
    name: 'Overdue Alert Hook',
    url: 'https://erp.internal/hooks/overdue',
    eventType: WebhookEventType.LendingOverdue,
    isActive: false,
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 'w3',
    name: 'Approval Notifier',
    url: 'https://notify.internal/approvals',
    eventType: WebhookEventType.ApprovalCompleted,
    secret: 'whsec_def456',
    isActive: true,
    createdAt: '2026-03-01T10:00:00Z',
    lastTriggeredAt: '2026-04-28T11:30:00Z',
  },
  {
    id: 'w4',
    name: 'Destruction Log',
    url: 'https://compliance.internal/destruction',
    eventType: WebhookEventType.DestructionExecuted,
    isActive: true,
    createdAt: '2026-03-15T12:00:00Z',
  },
];

export const connectorsSeed: IntegrationConnector[] = [
  {
    id: 'con1',
    name: 'Admin Communications System',
    type: ConnectorType.AdminComms,
    status: ConnectorStatus.Active,
    endpoint: 'https://admin-comms.internal/api/v1',
    description: 'Receives incoming documents from the ministry administrative communications platform. F11.4',
  },
  {
    id: 'con2',
    name: 'Electronic Archiving System (DMS)',
    type: ConnectorType.DMS,
    status: ConnectorStatus.Inactive,
    endpoint: 'https://dms.internal/iso15489/exchange',
    description: 'Import/export records in ISO 15489 metadata format with the existing document management system. F11.5',
  },
];

export const defaultSmtpConfig: SmtpConfig = {
  host:        'smtp.dacms.gov',
  port:        587,
  username:    'noreply@dacms.gov',
  useTls:      true,
  fromAddress: 'noreply@dacms.gov',
  fromName:    'DACMS System',
};

export const defaultLdapConfig: LdapConfig = {
  host:            'ldap.dacms.gov',
  port:            636,
  baseDn:          'dc=dacms,dc=gov',
  bindDn:          'cn=svc-dacms,ou=service,dc=dacms,dc=gov',
  isEnabled:       false,
  fallbackToLocal: true,
};

export const defaultSystemStatus = SystemStatus.Connected;
