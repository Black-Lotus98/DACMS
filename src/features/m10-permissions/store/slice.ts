import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { accessLogsSeed, defaultPasswordPolicy, permissionGroupsSeed, permissionsSeed, rolesSeed, usersSeed } from '../data';
import type { AccessLog, PasswordPolicy, PermissionGroup, PermissionsState, RoleEntity, UserEntity } from '../types';

const initialState: PermissionsState = {
  users:            usersSeed,
  roles:            rolesSeed,
  permissions:      permissionsSeed,
  permissionGroups: permissionGroupsSeed,
  accessLogs:       accessLogsSeed,
  passwordPolicy:   defaultPasswordPolicy,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // ── users (F10.1) ──────────────────────────────────────────────────────
    addUser(state, action: PayloadAction<UserEntity>) {
      state.users.unshift(action.payload);
    },
    editUser(state, action: PayloadAction<UserEntity>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    toggleUserActive(state, action: PayloadAction<string>) {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) user.isActive = !user.isActive;
    },

    // ── roles (F10.2) ──────────────────────────────────────────────────────
    setUserRoles(state, action: PayloadAction<{ userId: string; roleIds: string[] }>) {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) user.roleIds = action.payload.roleIds;
    },
    addRole(state, action: PayloadAction<RoleEntity>) {
      state.roles.push(action.payload);
    },
    editRole(state, action: PayloadAction<RoleEntity>) {
      const idx = state.roles.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.roles[idx] = action.payload;
    },
    toggleRolePermission(state, action: PayloadAction<{ roleId: string; permKey: string }>) {
      const role = state.roles.find((r) => r.id === action.payload.roleId);
      if (!role) return;
      const idx = role.permissionKeys.indexOf(action.payload.permKey);
      if (idx !== -1) role.permissionKeys.splice(idx, 1);
      else role.permissionKeys.push(action.payload.permKey);
    },

    // ── permission groups (F10.3) ──────────────────────────────────────────
    addPermissionGroup(state, action: PayloadAction<PermissionGroup>) {
      state.permissionGroups.push(action.payload);
    },
    updatePermissionGroup(state, action: PayloadAction<PermissionGroup>) {
      const idx = state.permissionGroups.findIndex((g) => g.id === action.payload.id);
      if (idx !== -1) state.permissionGroups[idx] = action.payload;
    },
    deletePermissionGroup(state, action: PayloadAction<string>) {
      state.permissionGroups = state.permissionGroups.filter((g) => g.id !== action.payload);
    },

    // ── access log (F10.6) ─────────────────────────────────────────────────
    addAccessLog(state, action: PayloadAction<AccessLog>) {
      state.accessLogs.unshift(action.payload);
    },

    // ── password policy (F10.8) ────────────────────────────────────────────
    updatePasswordPolicy(state, action: PayloadAction<PasswordPolicy>) {
      state.passwordPolicy = action.payload;
    },
  },
});

export const {
  addUser, editUser, toggleUserActive,
  setUserRoles, addRole, editRole, toggleRolePermission,
  addPermissionGroup, updatePermissionGroup, deletePermissionGroup,
  addAccessLog,
  updatePasswordPolicy,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
