'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { updatePreferenceForType } from '../store/slice';
import { useNotificationsModule } from '../hooks';
import { NotificationType, NotificationChannel } from '../types';

const TYPE_META: Record<NotificationType, { en: string; ar: string; description: string }> = {
  [NotificationType.TaskAssigned]:  { en: 'Task Assigned',   ar: 'مهمة مُسندة',          description: 'Workflow task assignments and completions' },
  [NotificationType.Approved]:      { en: 'Approved',        ar: 'موافقة',               description: 'Request approvals' },
  [NotificationType.Rejected]:      { en: 'Rejected',        ar: 'مرفوض',               description: 'Request rejections' },
  [NotificationType.Overdue]:       { en: 'Overdue',         ar: 'متأخر',               description: 'Lending requests past due date' },
  [NotificationType.Expiry]:        { en: 'Expiry',          ar: 'انتهاء فترة احتفاظ',  description: 'Record retention period expiring (30-day and 7-day warnings)' },
  [NotificationType.SlaBreach]:     { en: 'SLA Breach',      ar: 'خرق مستوى الخدمة',    description: 'Service level agreement time limit exceeded' },
  [NotificationType.CapacityAlert]: { en: 'Capacity Alert',  ar: 'تحذير سعة',           description: 'Storage occupancy exceeds configured threshold' },
};

const CHANNEL_OPTIONS: { value: NotificationChannel; label: string }[] = [
  { value: NotificationChannel.Both,  label: 'In-App & Email' },
  { value: NotificationChannel.InApp, label: 'In-App only' },
  { value: NotificationChannel.Email, label: 'Email only' },
  { value: NotificationChannel.None,  label: 'Muted' },
];

export function NotificationPreferencesPage() {
  const dispatch = useAppDispatch();
  const { local } = useParams<{ local: string }>();
  const { getPreferenceForType } = useNotificationsModule();

  function handleChange(notifType: NotificationType, channel: NotificationChannel) {
    const existing = getPreferenceForType(notifType);
    dispatch(updatePreferenceForType({
      prefId: existing?.prefId ?? `pref-${notifType}`,
      userId: 'current-user',
      notifType,
      channel,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <p className="text-sm text-muted-foreground">Configure delivery channel per notification type — F8.6.</p>
        </div>
        <Link href={`/${local}/notifications`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to notifications
        </Link>
      </div>

      <section className="rounded-xl border bg-background divide-y">
        {Object.values(NotificationType).map((type) => {
          const meta = TYPE_META[type];
          const pref = getPreferenceForType(type);
          const current = pref?.channel ?? NotificationChannel.Both;

          return (
            <div key={type} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">{meta.en} <span className="text-muted-foreground">/ {meta.ar}</span></p>
                <p className="text-xs text-muted-foreground">{meta.description}</p>
              </div>
              <select
                value={current}
                onChange={(e) => handleChange(type, e.target.value as NotificationChannel)}
                className="h-9 rounded-md border bg-background px-2 text-sm min-w-[160px]"
              >
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </section>

      <p className="text-xs text-muted-foreground">
        Setting a type to <strong>Muted</strong> stops all delivery for that event. Changes take effect immediately.
      </p>
    </div>
  );
}
