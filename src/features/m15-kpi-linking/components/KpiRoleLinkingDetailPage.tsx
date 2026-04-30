'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useParams } from 'next/navigation';
import { useKpiLinkingModule } from '../hooks';
import { ROLE_LABELS, type RoleType } from '@/config/roles';

export function KpiRoleLinkingDetailPage() {
  const { local, role } = useParams<{ local: string; role: string }>();
  const { getMappingByRole } = useKpiLinkingModule();
  const kpis = useAppSelector((s) => s.kpi.definitions);

  const mapping = getMappingByRole(role);

  if (!mapping) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Role mapping not found</h1>
        <p className="text-sm text-muted-foreground">No KPI mapping exists for this role.</p>
        <Link href={`/${local}/kpi-linking`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to KPI linking
        </Link>
      </div>
    );
  }

  const linkedKpis = kpis.filter((kpi) => mapping.kpiKeys.includes(kpi.key));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Role KPI view: {ROLE_LABELS[mapping.role as RoleType] ?? mapping.role}</h1>
          <p className="text-sm text-muted-foreground">Focused mapping details for this role.</p>
        </div>
        <Link href={`/${local}/kpi-linking`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to KPI linking
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Linked KPIs</h2>
        {linkedKpis.length === 0 ? (
          <p className="text-sm text-muted-foreground">No KPIs linked to this role.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {linkedKpis.map((kpi) => (
              <li key={kpi.id} className="border rounded-md p-2">
                <span className="font-medium">{kpi.nameEn}</span>
                <span className="text-muted-foreground"> ({kpi.key})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
