import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useDataModelsModule() {
  const { documentTypes, categories, metadataFields, retentionPolicies, optionSets } = useAppSelector(
    (s) => s.dataModels
  );

  return useMemo(() => ({
    documentTypes,
    categories,
    metadataFields,
    retentionPolicies,
    optionSets,

    // Document types
    getDocTypeById: (id: string) => documentTypes.find((d) => d.id === id) ?? null,
    getActiveDocTypes: () => documentTypes.filter((d) => d.isActive),

    // Categories
    getRootCategories: (docTypeId: string) =>
      categories.filter((c) => c.docTypeId === docTypeId && !c.parentId),
    getChildCategories: (parentId: string) =>
      categories.filter((c) => c.parentId === parentId),
    getCategoriesForType: (docTypeId: string) =>
      categories.filter((c) => c.docTypeId === docTypeId),
    getCategoryById: (id: string) => categories.find((c) => c.id === id) ?? null,

    // Metadata fields
    getFieldsForType: (docTypeId: string) =>
      metadataFields.filter((f) => f.docTypeId === docTypeId),
    getRequiredFields: (docTypeId: string) =>
      metadataFields.filter((f) => f.docTypeId === docTypeId && f.isRequired),

    // Retention policies
    getPolicyById: (id: string) => retentionPolicies.find((p) => p.id === id) ?? null,
    getPolicyByDocTypeId: (docTypeId: string) =>
      retentionPolicies.find((p) => p.docTypeId === docTypeId) ?? null,

    // Option sets (F2.5)
    getOptionSetById: (id: string) => optionSets.find((o) => o.id === id) ?? null,
  }), [documentTypes, categories, metadataFields, retentionPolicies, optionSets]);
}
