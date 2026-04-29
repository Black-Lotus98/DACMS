import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useDataModelsModule() {
  const { documentTypes, categories, metadataFields, retentionPolicies } = useAppSelector(
    (s) => s.dataModels
  );

  return useMemo(() => ({
    documentTypes,
    categories,
    metadataFields,
    retentionPolicies,
    getCategoriesForType: (docTypeId: string) =>
      categories.filter((c) => c.docTypeId === docTypeId && !c.parentId),
    getChildCategories: (parentId: string) =>
      categories.filter((c) => c.parentId === parentId),
    getFieldsForType: (docTypeId: string) =>
      metadataFields.filter((f) => f.docTypeId === docTypeId),
    getPolicyById: (id: string) =>
      retentionPolicies.find((p) => p.id === id),
    getDocTypeById: (id: string) => documentTypes.find((d) => d.id === id) ?? null,
  }), [documentTypes, categories, metadataFields, retentionPolicies]);
}
