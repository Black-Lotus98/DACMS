'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { markAsRead, markAllAsRead } from '../store/slice';
import { useNotificationsModule } from '../hooks';
import { NotificationType } from '../types';

const TYPE_LABELS: Record<NotificationType, { en: string; color: string }> = {
  [NotificationType.TaskAssigned]:  { en: 'Task Assigned',   color: 'bg-blue-100 text-blue-800' },
  [NotificationType.Approved]:      { en: 'Approved',        color: 'bg-green-100 text-green-800' },
  [NotificationType.Rejected]:      { en: 'Rejected',        color: 'bg-red-100 text-red-800' },
  [NotificationType.Overdue]:       { en: 'Overdue',         color: 'bg-orange-100 text-orange-800' },
  [NotificationType.Expiry]:        { en: 'Expiry',          color: 'bg-yellow-100 text-yellow-800' },
  [NotificationType.SlaBreach]:     { en: 'SLA Breach',      color: 'bg-purple-100 text-purple-800' },
  [NotificationType.CapacityAlert]: { en: 'Capacity Alert',  color: 'bg-gray-100 text-gray-800' },
};

export function UnreadNotificationsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { unreadItems, unreadCount } = useNotificationsModule();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Unread Notifications</h1>
          <p className="text-sm text-muted-foreground">Items that still need your attention.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${local}/notifications`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
            All notifications
          </Link>
          <button onClick={() => dispatch(markAllAsRead())} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
            Mark all as read
          </button>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <div className="mb-3 text-sm text-muted-foreground">{unreadCount} unread</div>
        <ul className="space-y-2 text-sm">
          {unreadItems.length === 0 ? (
            <li className="border rounded-md p-3 text-muted-foreground">No unread notifications.</li>
          ) : (
            unreadItems.map((n) => {
              const label = TYPE_LABELS[n.type];
              return (
                <li key={n.id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${label.color}`}>{label.en}</span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      </div>
                      <p className="font-medium">{n.titleEn}</p>
                      <p className="text-muted-foreground text-xs">{n.titleAr}</p>
                      <p className="text-muted-foreground">{n.bodyEn}</p>
                      {n.link && (
                        <Link href={`/${local}${n.link}`} className="text-xs text-blue-600 hover:underline">
                          View record →
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => dispatch(markAsRead(n.id))}
                      className="text-xs h-8 px-2 rounded-md border hover:bg-muted whitespace-nowrap shrink-0"
                    >
                      Mark read
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
