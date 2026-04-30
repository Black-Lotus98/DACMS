'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useDataModelsModule } from '../hooks';
import { toggleDocumentTypeActive } from '../store/slice';
import { ActionAfter } from '../types';

const ACTION_COLOR: Record<ActionAfter, string> = {
  [ActionAfter.Destroy]: 'bg-red-100 text-red-700',
  [ActionAfter.Migrate]: 'bg-blue-100 text-blue-700',
  [ActionAfter.Review]:  'bg-amber-100 text-amber-700',
};

export function DataModelTypeDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getDocTypeById, getRootCategories, getChildCategories, getFieldsForType, getPolicyByDocTypeId, getOptionSetById } = useDataModelsModule();

  const docType = getDocTypeById(id);

  if (!docType) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Document type not found</h1>
        <p className="text-sm text-muted-foreground">This document type id does not exist in current data models.</p>
        <Link href={`/${local}/data-models`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to data models
        </Link>
      </div>
    );
  }

  const policy       = getPolicyByDocTypeId(docType.id);
  const rootCats     = getRootCategories(docType.id);
  const fields       = getFieldsForType(docType.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{docType.nameAr}</h1>
          <p className="text-sm text-muted-foreground">{docType.nameEn}</p>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">{docType.code}</p>
          {docType.description && <p className="text-sm mt-1">{docType.description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dispatch(toggleDocumentTypeActive(docType.id))}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            {docType.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <Link href={`/${local}/data-models`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            Back
          </Link>
        </div>
      </div>

      {/* Retention policy */}
      <section className="rounded-xl border bg-background p-4 space-y-2">
        <h2 className="font-semibold text-sm">Retention policy</h2>
        {policy ? (
          <div className="flex items-center gap-3 text-sm">
            <span>{policy.periodYears} years</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLOR[policy.actionAfter]}`}>
              {policy.actionAfter}
            </span>
            {policy.legalRef && <span className="text-muted-foreground text-xs">{policy.legalRef}</span>}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No retention policy assigned.</p>
        )}
      </section>

      {/* Category hierarchy */}
      <section className="rounded-xl border bg-background p-4 space-y-2">
        <h2 className="font-semibold text-sm">Category hierarchy</h2>
        {rootCats.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories defined.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {rootCats.map((cat) => {
              const children = getChildCategories(cat.id);
              return (
                <li key={cat.id}>
                  <div className="flex items-center gap-2 py-1.5 border rounded-md px-3">
                    <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{cat.code}</span>
                    <span className="flex-1">{cat.nameAr}</span>
                    <span className="text-muted-foreground text-xs">{cat.nameEn}</span>
                  </div>
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center gap-2 py-1.5 border rounded-md px-3 mt-1 ms-6">
                      <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{child.code}</span>
                      <span className="flex-1">{child.nameAr}</span>
                      <span className="text-muted-foreground text-xs">{child.nameEn}</span>
                    </div>
                  ))}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Metadata fields */}
      <section className="rounded-xl border bg-background p-4 space-y-2">
        <h2 className="font-semibold text-sm">Metadata fields</h2>
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No metadata fields defined.</p>
        ) : (
          <ul className="space-y-1">
            {fields.map((f) => {
              const optionSet = f.optionSetId ? getOptionSetById(f.optionSetId) : null;
              return (
                <li key={f.id} className="flex items-center gap-3 border rounded-md px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground w-32 shrink-0">{f.fieldKey}</span>
                  <span className="flex-1">{f.labelAr}</span>
                  <span className="text-muted-foreground text-xs">{f.labelEn}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted font-mono">{f.fieldType}</span>
                  {f.isRequired && <span className="text-xs text-red-600 font-medium">required</span>}
                  {optionSet && <span className="text-xs text-muted-foreground">{optionSet.options.length} options</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
