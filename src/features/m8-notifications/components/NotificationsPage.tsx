'use client';

import { useNotificationsModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { markAsRead, markAllAsRead, updatePreferences } from '../store/slice';

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items, unreadCount, preferences } = useNotificationsModule();

  function togglePreference(key: 'email' | 'inApp' | 'overdueAlerts') {
    dispatch(
      updatePreferences({
        ...preferences,
        [key]: !preferences[key],
      })
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التنبيهات وNotifications</h1>
          <p className="text-sm text-muted-foreground">M8: سجل Notifications مع عدد غير المقروء.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-primary-a0 text-white px-3 py-1 rounded-full">Unread: {unreadCount}</span>
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">سجل Notifications</h2>
        <ul className="space-y-2 text-sm">
          {items.map((n) => (
            <li key={n.id} className={`border rounded-md p-3 ${n.read ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-muted-foreground">{n.message}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => dispatch(markAsRead(n.id))}
                    className="text-xs h-8 px-2 rounded-md border hover:bg-muted whitespace-nowrap"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Notification settings</h2>
        <div className="grid sm:grid-cols-3 gap-2 text-sm">
          <button onClick={() => togglePreference('email')} className="border rounded-md p-2 text-start hover:bg-muted">Email: {String(preferences.email)}</button>
          <button onClick={() => togglePreference('inApp')} className="border rounded-md p-2 text-start hover:bg-muted">In-App: {String(preferences.inApp)}</button>
          <button onClick={() => togglePreference('overdueAlerts')} className="border rounded-md p-2 text-start hover:bg-muted">Overdue: {String(preferences.overdueAlerts)}</button>
        </div>
      </section>
    </div>
  );
}
