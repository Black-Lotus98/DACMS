import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { RoleType, ClearanceLevel, ROLE_CLEARANCE } from '@/config/roles';
import type { User, AuthSession } from '@/types';

const initialState: AuthSession = {
  user: null,
  role: null,
  clearanceLevel: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<RoleType>) {
      const role = action.payload;
      state.role = role;
      state.clearanceLevel = ROLE_CLEARANCE[role];
      state.isAuthenticated = true;
      if (!state.user) {
        state.user = {
          id: `mock-${role}`,
          name: mockUserName(role),
          email: `${role}@dacms.gov`,
          role,
          clearanceLevel: ROLE_CLEARANCE[role],
        };
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.role = action.payload.role;
      state.clearanceLevel = action.payload.clearanceLevel;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.clearanceLevel = null;
      state.isAuthenticated = false;
    },
  },
});

function mockUserName(role: RoleType): string {
  const names: Record<RoleType, string> = {
    [RoleType.CenterDirector]: 'Ahmad Al-Zahrani',
    [RoleType.ArchiveSupervisor]: 'Fatimah Al-Omari',
    [RoleType.ArchiveOfficer]: 'Mohammad Al-Qahtani',
    [RoleType.Admin]: 'Sarah Al-Ghamdi',
    [RoleType.Beneficiary]: 'Khalid Al-Shahri',
  };
  return names[role];
}

export const { setRole, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
