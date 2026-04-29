import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
export function useKpiLinkingModule(){ const s=useAppSelector((x)=>x.kpiLinking); return useMemo(()=>({mappings:s.mappings}),[s]); }
