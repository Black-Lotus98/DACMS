'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useNotificationsModule } from '../hooks';
import { markAsRead, markAllAsRead } from '../store/slice';

export function UnreadNotificationsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { unreadItems, unreadCount } = useNotificationsModule();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Unread notifications</h1>
          <p className="text-sm text-muted-foreground">Focus on unread items that still need user action.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${local}/notifications`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
            Back to notifications
          </Link>
          <button onClick={() => dispatch(markAllAsRead())} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
            Mark all as read
          </button>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <div className="mb-3 text-sm text-muted-foreground">Unread count: {unreadCount}</div>
        <ul className="space-y-2 text-sm">
          {unreadItems.length === 0 ? (
            <li className="border rounded-md p-3 text-muted-foreground">No unread notifications right now.</li>
          ) : (
            unreadItems.map((n) => (
              <li key={n.id} className="border rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted-foreground">{n.message}</p>
                  </div>
                  <button onClick={() => dispatch(markAsRead(n.id))} className="text-xs h-8 px-2 rounded-md border hover:bg-muted whitespace-nowrap">
                    Mark as read
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
