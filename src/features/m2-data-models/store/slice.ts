import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BoxTemplate, DataModelsState, DocumentCategory, DocumentType, MetadataField, OptionSet, RetentionPolicy, ShelfTemplate } from '../types';
import { boxTemplatesSeed, categoriesSeed, documentTypesSeed, metadataFieldsSeed, optionSetsSeed, retentionPoliciesSeed, shelfTemplatesSeed } from '../data';

const initialState: DataModelsState = {
  documentTypes: documentTypesSeed,
  categories: categoriesSeed,
  metadataFields: metadataFieldsSeed,
  retentionPolicies: retentionPoliciesSeed,
  optionSets: optionSetsSeed,
  boxTemplates: boxTemplatesSeed,
  shelfTemplates: shelfTemplatesSeed,
};

const dataModelsSlice = createSlice({
  name: 'dataModels',
  initialState,
  reducers: {
    // --- Document Types ---
    addDocumentType(state, action: PayloadAction<DocumentType>) {
      state.documentTypes.unshift(action.payload);
    },
    updateDocumentType(state, action: PayloadAction<DocumentType>) {
      const idx = state.documentTypes.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.documentTypes[idx] = action.payload;
    },
    toggleDocumentTypeActive(state, action: PayloadAction<string>) {
      const dt = state.documentTypes.find((d) => d.id === action.payload);
      if (dt) dt.isActive = !dt.isActive;
    },

    // --- Categories ---
    addCategory(state, action: PayloadAction<DocumentCategory>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<DocumentCategory>) {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = action.payload;
    },

    // --- Metadata Fields ---
    addMetadataField(state, action: PayloadAction<MetadataField>) {
      state.metadataFields.push(action.payload);
    },
    updateMetadataField(state, action: PayloadAction<MetadataField>) {
      const idx = state.metadataFields.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.metadataFields[idx] = action.payload;
    },

    // --- Retention Policies ---
    addRetentionPolicy(state, action: PayloadAction<RetentionPolicy>) {
      state.retentionPolicies.push(action.payload);
    },
    updateRetentionPolicy(state, action: PayloadAction<RetentionPolicy>) {
      const idx = state.retentionPolicies.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.retentionPolicies[idx] = action.payload;
    },

    // --- Option Sets (F2.5) ---
    addOptionSet(state, action: PayloadAction<OptionSet>) {
      state.optionSets.push(action.payload);
    },
    updateOptionSet(state, action: PayloadAction<OptionSet>) {
      const idx = state.optionSets.findIndex((o) => o.id === action.payload.id);
      if (idx !== -1) state.optionSets[idx] = action.payload;
    },

    // --- Box Templates (F2.7) ---
    addBoxTemplate(state, action: PayloadAction<BoxTemplate>) {
      state.boxTemplates.push(action.payload);
    },
    updateBoxTemplate(state, action: PayloadAction<BoxTemplate>) {
      const idx = state.boxTemplates.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state.boxTemplates[idx] = action.payload;
    },
    deleteBoxTemplate(state, action: PayloadAction<string>) {
      state.boxTemplates = state.boxTemplates.filter((b) => b.id !== action.payload);
    },

    // --- Shelf Templates (F2.8) ---
    addShelfTemplate(state, action: PayloadAction<ShelfTemplate>) {
      state.shelfTemplates.push(action.payload);
    },
    updateShelfTemplate(state, action: PayloadAction<ShelfTemplate>) {
      const idx = state.shelfTemplates.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.shelfTemplates[idx] = action.payload;
    },
    deleteShelfTemplate(state, action: PayloadAction<string>) {
      state.shelfTemplates = state.shelfTemplates.filter((s) => s.id !== action.payload);
    },
  },
});

export const {
  addDocumentType, updateDocumentType, toggleDocumentTypeActive,
  addCategory, updateCategory,
  addMetadataField, updateMetadataField,
  addRetentionPolicy, updateRetentionPolicy,
  addOptionSet, updateOptionSet,
  addBoxTemplate, updateBoxTemplate, deleteBoxTemplate,
  addShelfTemplate, updateShelfTemplate, deleteShelfTemplate,
} = dataModelsSlice.actions;

export default dataModelsSlice.reducer;
