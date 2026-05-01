import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Branch, Department, Organization, OrgState } from '../types';
import { orgSeed, branchesSeed, departmentsSeed, levelDefinitionsSeed } from '../data';

const initialState: OrgState = {
  organization:     orgSeed,
  branches:         branchesSeed,
  departments:      departmentsSeed,
  levelDefinitions: levelDefinitionsSeed,
};

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    updateOrganization(state, action: PayloadAction<Partial<Organization>>) {
      state.organization = { ...state.organization, ...action.payload };
    },

    addBranch(state, action: PayloadAction<Branch>) {
      state.branches.push(action.payload);
    },
    toggleBranch(state, action: PayloadAction<string>) {
      const branch = state.branches.find((b) => b.id === action.payload);
      if (branch) branch.isActive = !branch.isActive;
    },

    addDepartment(state, action: PayloadAction<Department>) {
      state.departments.push(action.payload);
    },
    updateDepartment(state, action: PayloadAction<Department>) {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.departments[idx] = action.payload;
    },
    deleteDepartment(state, action: PayloadAction<string>) {
      state.departments = state.departments.filter((d) => d.id !== action.payload);
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

export const {
  updateOrganization,
  addBranch, toggleBranch,
  addDepartment, updateDepartment, deleteDepartment,
  assignDepartmentResponsible,
} = orgSlice.actions;

export default orgSlice.reducer;
