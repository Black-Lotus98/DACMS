import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
export function useKpiLinkingModule(){ const s=useAppSelector((x)=>x.kpiLinking); return useMemo(()=>({mappings:s.mappings, getMappingByRole:(role:string)=>s.mappings.find((m)=>m.role===role)??null}),[s]); }
