import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { notificationsSeed, notificationPreferencesSeed } from '../data';
import type { NotificationsState, NotificationItem, NotificationPreferences } from '../types';

const initialState: NotificationsState = {
  items: notificationsSeed,
  unreadCount: notificationsSeed.filter((n) => !n.read).length,
  preferences: notificationPreferencesSeed,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markAllAsRead(state) {
      state.items = state.items.map((item) => ({ ...item, read: true }));
      state.unreadCount = 0;
    },
    updatePreferences(state, action: PayloadAction<NotificationPreferences>) {
      state.preferences = action.payload;
    },
  },
});

export const { markAsRead, addNotification, markAllAsRead, updatePreferences } = notificationsSlice.actions;
export default notificationsSlice.reducer;
