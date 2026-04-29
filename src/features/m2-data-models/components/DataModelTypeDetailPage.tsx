'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDataModelsModule } from '../hooks';

export function DataModelTypeDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getDocTypeById, getCategoriesForType, getFieldsForType, getPolicyById } = useDataModelsModule();

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

  const categories = getCategoriesForType(docType.id);
  const fields = getFieldsForType(docType.id);
  const policy = getPolicyById(docType.retentionPolicyId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Type view: {docType.name}</h1>
          <p className="text-sm text-muted-foreground">Code: {docType.code}</p>
        </div>
        <Link href={`/${local}/data-models`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to data models
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Retention policy</h2>
        <p className="text-sm text-muted-foreground">{policy ? `${policy.name} (${policy.periodYears} years)` : 'No retention policy found.'}</p>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories defined for this type.</p>
        ) : (
          <ul className="space-y-2 text-sm">{categories.map((c) => <li key={c.id} className="border rounded-md p-2">{c.name}</li>)}</ul>
        )}
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Metadata fields</h2>
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No metadata fields defined for this type.</p>
        ) : (
          <ul className="space-y-2 text-sm">{fields.map((f) => <li key={f.id} className="border rounded-md p-2">{f.label} <span className="text-muted-foreground">({f.fieldType})</span></li>)}</ul>
        )}
      </section>
    </div>
  );
}
