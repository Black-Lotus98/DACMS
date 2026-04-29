import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
export function useIntegrationModule(){ const s=useAppSelector((x)=>x.integration); return useMemo(()=>({apiKeys:s.apiKeys, webhooks:s.webhooks, status:s.status}),[s]); }
