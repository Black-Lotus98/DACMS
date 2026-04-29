import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DataModelsState, DocumentCategory, DocumentType, MetadataField, RetentionPolicy } from '../types';
import { categoriesSeed, documentTypesSeed, metadataFieldsSeed, retentionPoliciesSeed } from '../data';

const initialState: DataModelsState = {
  documentTypes: documentTypesSeed,
  categories: categoriesSeed,
  metadataFields: metadataFieldsSeed,
  retentionPolicies: retentionPoliciesSeed,
};

const dataModelsSlice = createSlice({
  name: 'dataModels',
  initialState,
  reducers: {
    addDocumentType(state, action: PayloadAction<DocumentType>) {
      state.documentTypes.unshift(action.payload);
    },
    addMetadataField(state, action: PayloadAction<MetadataField>) {
      state.metadataFields.push(action.payload);
    },
    addCategory(state, action: PayloadAction<DocumentCategory>) {
      state.categories.push(action.payload);
    },
    addRetentionPolicy(state, action: PayloadAction<RetentionPolicy>) {
      state.retentionPolicies.push(action.payload);
    },
  },
});

export const { addDocumentType, addMetadataField, addCategory, addRetentionPolicy } = dataModelsSlice.actions;
export default dataModelsSlice.reducer;
