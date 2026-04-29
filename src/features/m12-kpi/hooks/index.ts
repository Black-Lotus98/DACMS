import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useKpiModule() {
  const kpiState = useAppSelector((x) => x.kpi);
  const mappingsState = useAppSelector((x) => x.kpiLinking);

  return useMemo(
    () => ({
      kpis: kpiState.definitions,
      mappings: mappingsState.mappings,
      getKpisForRole: (role: string) => {
        const mapping = mappingsState.mappings.find((m) => m.role === role);
        if (!mapping) return [];
        return kpiState.definitions.filter((k) => mapping.kpiKeys.includes(k.key));
      },
    }),
    [kpiState.definitions, mappingsState.mappings]
  );
}
