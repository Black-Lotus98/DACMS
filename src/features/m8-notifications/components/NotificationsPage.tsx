'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markAsRead, markAllAsRead, deleteNotification, createNotificationFromEvent } from '../store/slice';
import { useNotificationsModule } from '../hooks';
import { NotificationType, NotificationChannel, type NotificationItem } from '../types';
import { LendingStatus } from '@/features/m6-lending';

const TYPE_LABELS: Record<NotificationType, { ar: string; en: string; color: string }> = {
  [NotificationType.TaskAssigned]: { ar: 'مهمة مُسندة', en: 'Task Assigned', color: 'bg-blue-100 text-blue-800' },
  [NotificationType.Approved]:    { ar: 'موافقة', en: 'Approved', color: 'bg-green-100 text-green-800' },
  [NotificationType.Rejected]:    { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-100 text-red-800' },
  [NotificationType.Overdue]:     { ar: 'متأخر', en: 'Overdue', color: 'bg-orange-100 text-orange-800' },
  [NotificationType.Expiry]:      { ar: 'انتهاء احتفاظ', en: 'Expiry', color: 'bg-yellow-100 text-yellow-800' },
  [NotificationType.SlaBreach]:   { ar: 'خرق SLA', en: 'SLA Breach', color: 'bg-purple-100 text-purple-800' },
  [NotificationType.CapacityAlert]: { ar: 'تحذير سعة', en: 'Capacity Alert', color: 'bg-gray-100 text-gray-800' },
};

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  [NotificationChannel.InApp]: 'In-App',
  [NotificationChannel.Email]: 'Email',
  [NotificationChannel.Both]:  'Both',
  [NotificationChannel.None]:  'None',
};

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { items, unreadCount } = useNotificationsModule();
  const lendingRequests = useAppSelector((s) => s.lending.requests);
  const records = useAppSelector((s) => s.records.items);
  const rooms = useAppSelector((s) => s.archiveStructure.rooms);

  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL');
  const [filterRead, setFilterRead]  = useState<'ALL' | 'READ' | 'UNREAD'>('ALL');
  const [filterFrom, setFilterFrom]  = useState('');
  const [filterTo, setFilterTo]      = useState('');

  const filtered = items.filter((n: NotificationItem) => {
    if (filterType !== 'ALL' && n.type !== filterType) return false;
    if (filterRead === 'READ' && !n.isRead) return false;
    if (filterRead === 'UNREAD' && n.isRead) return false;
    if (filterFrom && n.createdAt < filterFrom) return false;
    if (filterTo   && n.createdAt > filterTo + 'T23:59:59Z') return false;
    return true;
  });

  function hasNotification(type: NotificationType, link: string) {
    return items.some((n) => n.type === type && n.link === link);
  }

  function runDailyJob() {
    const now = new Date();
    const todayIso = now.toISOString();
    const today = todayIso.slice(0, 10);

    for (const request of lendingRequests) {
      if (!request.dueDate || request.status !== LendingStatus.Active) continue;
      if (request.dueDate >= today) continue;
      const link = `/lending/${request.id}`;
      if (hasNotification(NotificationType.Overdue, link)) continue;
      dispatch(createNotificationFromEvent({
        id: `notif-overdue-${request.id}`,
        userId: 'current-user',
        type: NotificationType.Overdue,
        titleAr: 'تنبيه إعارة متأخرة',
        titleEn: 'Overdue Lending Alert',
        bodyAr: `طلب الإعارة ${request.refNo} متأخر عن موعد الإرجاع.`,
        bodyEn: `Lending request ${request.refNo} is overdue.`,
        link,
        createdAt: todayIso,
      }));
    }

    for (const record of records) {
      const msLeft = new Date(record.retentionEnd).getTime() - now.getTime();
      const daysLeft = Math.ceil(msLeft / 86_400_000);
      if (daysLeft !== 30 && daysLeft !== 7) continue;
      const link = `/records/${record.id}`;
      if (hasNotification(NotificationType.Expiry, link)) continue;
      dispatch(createNotificationFromEvent({
        id: `notif-expiry-${record.id}-${daysLeft}`,
        userId: 'current-user',
        type: NotificationType.Expiry,
        titleAr: `تنبيه انتهاء احتفاظ (${daysLeft} أيام)`,
        titleEn: `Retention Expiry Alert (${daysLeft} days)`,
        bodyAr: `السجل ${record.refNo} سينتهي خلال ${daysLeft} أيام.`,
        bodyEn: `Record ${record.refNo} retention expires in ${daysLeft} days.`,
        link,
        createdAt: todayIso,
      }));
    }

    for (const room of rooms) {
      const occupancy = room.capacity > 0 ? Math.round((room.currentUse / room.capacity) * 100) : 0;
      if (occupancy < 90) continue;
      const link = '/archive-structure';
      const key = `${room.id}-${today}`;
      if (hasNotification(NotificationType.CapacityAlert, `${link}#${room.id}`)) continue;
      dispatch(createNotificationFromEvent({
        id: `notif-capacity-${key}`,
        userId: 'current-user',
        type: NotificationType.CapacityAlert,
        titleAr: 'تنبيه سعة التخزين',
        titleEn: 'Storage Capacity Alert',
        bodyAr: `الغرفة ${room.code} وصلت إلى ${occupancy}% من السعة.`,
        bodyEn: `Room ${room.code} reached ${occupancy}% occupancy.`,
        link: `${link}#${room.id}`,
        createdAt: todayIso,
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">M8 · Notification history — filter by type, date, and read status.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">Unread: {unreadCount}</span>
          <Link href={`/${local}/notifications/unread`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
            Unread
          </Link>
          <Link href={`/${local}/notifications/preferences`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
            Preferences
          </Link>
          <button onClick={() => dispatch(markAllAsRead())} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
            Mark all as read
          </button>
          <button onClick={runDailyJob} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">
            Run daily job
          </button>
        </div>
      </div>

      {/* Filters — F8.7 */}
      <section className="rounded-xl border bg-background p-4 space-y-3">
        <h2 className="font-semibold text-sm">Filters</h2>
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as NotificationType | 'ALL')}
              className="w-full h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="ALL">All types</option>
              {Object.values(NotificationType).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t].en}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Read status</label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as 'ALL' | 'READ' | 'UNREAD')}
              className="w-full h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">From date</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">To date</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-2 text-sm"
            />
          </div>
        </div>
        {(filterType !== 'ALL' || filterRead !== 'ALL' || filterFrom || filterTo) && (
          <button
            onClick={() => { setFilterType('ALL'); setFilterRead('ALL'); setFilterFrom(''); setFilterTo(''); }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear filters
          </button>
        )}
      </section>

      {/* Notification list */}
      <section className="rounded-xl border bg-background p-4">
        <div className="mb-3 text-sm text-muted-foreground">{filtered.length} notification{filtered.length !== 1 ? 's' : ''}</div>
        <ul className="space-y-2 text-sm">
          {filtered.length === 0 ? (
            <li className="border rounded-md p-3 text-muted-foreground">No notifications match the selected filters.</li>
          ) : (
            filtered.map((n) => {
              const label = TYPE_LABELS[n.type];
              return (
                <li key={n.id} className={`border rounded-md p-3 transition-opacity ${n.isRead ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${label.color}`}>{label.en}</span>
                        <span className="text-xs text-muted-foreground">{CHANNEL_LABELS[n.channel]}</span>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                      </div>
                      <p className="font-medium">{n.titleEn}</p>
                      <p className="text-muted-foreground text-xs">{n.titleAr}</p>
                      <p className="text-muted-foreground">{n.bodyEn}</p>
                      {n.link && (
                        <Link href={`/${local}${n.link}`} className="text-xs text-blue-600 hover:underline">
                          Open link →
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => dispatch(markAsRead(n.id))}
                          className="text-xs h-8 px-2 rounded-md border hover:bg-muted whitespace-nowrap"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => dispatch(deleteNotification(n.id))}
                        className="text-xs h-8 px-2 rounded-md border hover:bg-destructive/10 text-destructive whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
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
