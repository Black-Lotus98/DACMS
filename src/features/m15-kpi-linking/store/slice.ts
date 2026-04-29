import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mappingsSeed } from '../data';
import type { KpiLinkingState, KpiMapping } from '../types';
const initialState: KpiLinkingState = { mappings: mappingsSeed };
const kpiLinkingSlice=createSlice({ name:'kpiLinking', initialState, reducers:{ upsertMapping(state, action: PayloadAction<KpiMapping>){ const i=state.mappings.findIndex(m=>m.id===action.payload.id); if(i>=0) state.mappings[i]=action.payload; else state.mappings.unshift(action.payload);} } });
export const { upsertMapping } = kpiLinkingSlice.actions;
export default kpiLinkingSlice.reducer;
