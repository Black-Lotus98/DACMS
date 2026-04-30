import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Branch, Department, OrgState } from '../types';
import { orgSeed, branchesSeed, departmentsSeed } from '../data';

const initialState: OrgState = {
  organization: orgSeed,
  branches: branchesSeed,
  departments: departmentsSeed,
};

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    addBranch(state, action: PayloadAction<Branch>) {
      state.branches.push(action.payload);
    },
    addDepartment(state, action: PayloadAction<Department>) {
      state.departments.push(action.payload);
    },
    updateDepartment(state, action: PayloadAction<Department>) {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.departments[idx] = action.payload;
    },
    assignDepartmentResponsible(
      state,
      action: PayloadAction<{ departmentId: string; assigneeId: string; responsibleEmail?: string }>
    ) {
      const dept = state.departments.find((d) => d.id === action.payload.departmentId);
      if (!dept) return;
      dept.assigneeId = action.payload.assigneeId;
      dept.responsibleEmail = action.payload.responsibleEmail;
    },
  },
});

export const { addBranch, addDepartment, updateDepartment, assignDepartmentResponsible } = orgSlice.actions;
export default orgSlice.reducer;
