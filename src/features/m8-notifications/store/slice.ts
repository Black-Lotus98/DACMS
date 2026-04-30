import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { notificationsSeed, notificationPreferencesSeed } from '../data';
import {
  NotificationChannel,
  type NotificationsState,
  type NotificationItem,
  type NotificationPreference,
} from '../types';

const initialState: NotificationsState = {
  items: notificationsSeed,
  preferences: notificationPreferencesSeed,
  unreadCount: notificationsSeed.filter((n) => !n.isRead).length,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.isRead) {
        item.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items = state.items.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    createNotificationFromEvent(
      state,
      action: PayloadAction<Omit<NotificationItem, 'channel' | 'isRead'>>
    ) {
      const pref = state.preferences.find(
        (p) => p.userId === action.payload.userId && p.notifType === action.payload.type
      );
      const channel = pref?.channel ?? NotificationChannel.Both;
      if (channel === NotificationChannel.None) return;
      state.items.unshift({
        ...action.payload,
        channel,
        isRead: false,
      });
      state.unreadCount += 1;
    },
    deleteNotification(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    updatePreferenceForType(state, action: PayloadAction<NotificationPreference>) {
      const idx = state.preferences.findIndex((p) => p.notifType === action.payload.notifType && p.userId === action.payload.userId);
      if (idx !== -1) {
        state.preferences[idx] = action.payload;
      } else {
        state.preferences.push(action.payload);
      }
    },
  },
});

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  createNotificationFromEvent,
  deleteNotification,
  updatePreferenceForType,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
