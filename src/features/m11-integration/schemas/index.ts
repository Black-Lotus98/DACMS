import { z } from 'zod';
import { WebhookEventType, ConnectorType, ConnectorStatus } from '../types';

export const apiKeySchema = z.object({
  name:        z.string().min(2),
  permissions: z.array(z.string()).min(1, 'At least one permission required'),
  expiresAt:   z.string().optional(),
});

export const webhookSchema = z.object({
  name:      z.string().min(2),
  url:       z.string().url(),
  eventType: z.nativeEnum(WebhookEventType),
  secret:    z.string().optional(),
});

export const smtpConfigSchema = z.object({
  host:        z.string().min(1),
  port:        z.number().int().min(1).max(65535),
  username:    z.string().min(1),
  useTls:      z.boolean(),
  fromAddress: z.string().email(),
  fromName:    z.string().min(1),
});

export const ldapConfigSchema = z.object({
  host:            z.string().min(1),
  port:            z.number().int().min(1).max(65535),
  baseDn:          z.string().min(1),
  bindDn:          z.string().min(1),
  isEnabled:       z.boolean(),
  fallbackToLocal: z.boolean(),
});

export const connectorSchema = z.object({
  name:        z.string().min(2),
  type:        z.nativeEnum(ConnectorType),
  status:      z.nativeEnum(ConnectorStatus),
  endpoint:    z.string().url(),
  description: z.string().optional(),
});
