import { createSlice } from '@reduxjs/toolkit';
import { kpiSeed } from '../data';
import type { KPIState } from '../types';
const initialState: KPIState={ definitions: kpiSeed };
const kpiSlice=createSlice({ name:'kpi', initialState, reducers:{} });
export default kpiSlice.reducer;
