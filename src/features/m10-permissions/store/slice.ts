import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  accessLogsSeed,
  defaultLdapConfig,
  defaultPasswordPolicy,
  locationAccessRulesSeed,
  permissionGroupsSeed,
  permissionsSeed,
  rolesSeed,
  usersSeed,
} from '../data';
import type {
  AccessLog,
  LdapConfig,
  LocationAccessRule,
  PasswordPolicy,
  PermissionGroup,
  PermissionsState,
  RoleEntity,
  UserEntity,
} from '../types';

const initialState: PermissionsState = {
  users:            usersSeed,
  roles:            rolesSeed,
  permissions:      permissionsSeed,
  permissionGroups: permissionGroupsSeed,
  accessLogs:       accessLogsSeed,
  passwordPolicy:   defaultPasswordPolicy,
  locationAccessRules: locationAccessRulesSeed,
  ldapConfig: defaultLdapConfig,
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
      state.roles = state.roles.map((r) => ({
        ...r,
        permissionGroupIds: (r.permissionGroupIds ?? []).filter((id) => id !== action.payload),
      }));
      state.users = state.users.map((u) => ({
        ...u,
        permissionGroupIds: (u.permissionGroupIds ?? []).filter((id) => id !== action.payload),
      }));
    },
    assignPermissionGroupToRole(state, action: PayloadAction<{ roleId: string; groupId: string }>) {
      const role = state.roles.find((r) => r.id === action.payload.roleId);
      if (!role) return;
      const current = new Set(role.permissionGroupIds ?? []);
      if (current.has(action.payload.groupId)) current.delete(action.payload.groupId);
      else current.add(action.payload.groupId);
      role.permissionGroupIds = Array.from(current);
    },
    assignPermissionGroupToUser(state, action: PayloadAction<{ userId: string; groupId: string }>) {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (!user) return;
      const current = new Set(user.permissionGroupIds ?? []);
      if (current.has(action.payload.groupId)) current.delete(action.payload.groupId);
      else current.add(action.payload.groupId);
      user.permissionGroupIds = Array.from(current);
    },

    // ── access log (F10.6) ─────────────────────────────────────────────────
    addAccessLog(state, action: PayloadAction<AccessLog>) {
      state.accessLogs.unshift(action.payload);
    },

    // ── password policy (F10.8) ────────────────────────────────────────────
    updatePasswordPolicy(state, action: PayloadAction<PasswordPolicy>) {
      state.passwordPolicy = action.payload;
    },
    upsertLocationAccessRule(state, action: PayloadAction<LocationAccessRule>) {
      const idx = state.locationAccessRules.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.locationAccessRules[idx] = action.payload;
      else state.locationAccessRules.unshift(action.payload);
    },
    deleteLocationAccessRule(state, action: PayloadAction<string>) {
      state.locationAccessRules = state.locationAccessRules.filter((r) => r.id !== action.payload);
    },
    updateLdapConfig(state, action: PayloadAction<LdapConfig>) {
      state.ldapConfig = action.payload;
    },
  },
});

export const {
  addUser, editUser, toggleUserActive,
  setUserRoles, addRole, editRole, toggleRolePermission,
  addPermissionGroup, updatePermissionGroup, deletePermissionGroup,
  assignPermissionGroupToRole, assignPermissionGroupToUser,
  addAccessLog,
  updatePasswordPolicy,
  upsertLocationAccessRule, deleteLocationAccessRule, updateLdapConfig,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
