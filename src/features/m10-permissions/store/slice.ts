import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PermissionsState, UserEntity } from '../types';
import { accessLogsSeed, permissionsSeed, rolesSeed, usersSeed } from '../data';
import { ROLE_CLEARANCE } from '@/config/roles';

const initialState: PermissionsState = {
  users: usersSeed,
  roles: rolesSeed,
  permissions: permissionsSeed,
  accessLogs: accessLogsSeed,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<UserEntity>) {
      state.users.unshift(action.payload);
    },
    setUserRole(state, action: PayloadAction<{ userId: string; role: UserEntity['role'] }>) {
      const user = state.users.find((item) => item.id === action.payload.userId);
      if (!user) return;
      user.role = action.payload.role;
      user.clearanceLevel = ROLE_CLEARANCE[action.payload.role];
    },
    toggleRolePermission(state, action: PayloadAction<{ roleId: string; permissionKey: string }>) {
      const role = state.roles.find((r) => r.id === action.payload.roleId);
      if (!role) return;
      if (role.permissions.includes(action.payload.permissionKey)) {
        role.permissions = role.permissions.filter((p) => p !== action.payload.permissionKey);
      } else {
        role.permissions.push(action.payload.permissionKey);
      }
    },
  },
});

export const { addUser, setUserRole, toggleRolePermission } = permissionsSlice.actions;
export default permissionsSlice.reducer;
