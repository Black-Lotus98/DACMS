import { configureStore } from '@reduxjs/toolkit';
import { workflowListenerMiddleware } from './workflowListeners';
import authReducer from './authSlice';
import { permissionsReducer } from '@/features/m10-permissions';
import { orgReducer } from '@/features/m13-org-structure';
import { archiveStructureReducer } from '@/features/m1-archive-structure';
import { dataModelsReducer } from '@/features/m2-data-models';
import { recordsReducer } from '@/features/m3-records';
import { searchReducer } from '@/features/m4-search';
import { barcodesReducer } from '@/features/m5-barcodes';
import { workflowsReducer } from '@/features/m14-workflow';
import { lendingReducer } from '@/features/m6-lending';
import { destructionReducer } from '@/features/m7-destruction';
import { notificationsReducer } from '@/features/m8-notifications';
import { reportsReducer } from '@/features/m9-reports';
import { integrationReducer } from '@/features/m11-integration';
import { kpiReducer } from '@/features/m12-kpi';
import { kpiLinkingReducer } from '@/features/m15-kpi-linking';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(workflowListenerMiddleware.middleware),
  reducer: {
    auth: authReducer,
    permissions: permissionsReducer,
    org: orgReducer,
    archiveStructure: archiveStructureReducer,
    dataModels: dataModelsReducer,
    records: recordsReducer,
    search: searchReducer,
    barcodes: barcodesReducer,
    workflows: workflowsReducer,
    lending: lendingReducer,
    destruction: destructionReducer,
    notifications: notificationsReducer,
    reports: reportsReducer,
    integration: integrationReducer,
    kpi: kpiReducer,
    kpiLinking: kpiLinkingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
