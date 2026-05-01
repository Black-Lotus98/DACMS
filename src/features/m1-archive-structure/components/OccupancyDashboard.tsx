'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Warehouse } from 'lucide-react';
import { useArchiveModule } from '../hooks';
import { OccupancyBar } from './OccupancyBar';

const BORDER: Record<'normal' | 'warning' | 'critical', string> = {
  normal:   'border-green-400',
  warning:  'border-amber-400',
  critical: 'border-red-400',
};

export function OccupancyDashboard() {
  const { local } = useParams<{ local: string }>();
  const { rooms, roomOccupancy, getOccupancyStatus, thresholds } = useArchiveModule();

  function exportCSV() {
    const rows = [
      ['Room', 'Code', 'Capacity', 'Occupancy %', 'Status'],
      ...rooms.map((room) => {
        const pct    = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;
        const status = getOccupancyStatus(pct);
        return [room.nameEn, room.code, room.capacity, pct, status];
      }),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a   = document.createElement('a');
    a.href    = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download = 'occupancy-report.csv';
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Color: Green &lt;{thresholds.warning}% · Amber {thresholds.warning}–{thresholds.critical - 1}% · Red ≥{thresholds.critical}%
        </p>
        <button
          onClick={exportCSV}
          className="h-8 px-3 rounded-md border text-sm hover:bg-muted"
        >
          Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const pct    = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;
          const status = getOccupancyStatus(pct);

          return (
            <Link
              key={room.id}
              href={`/${local}/archive-structure/room/${room.id}`}
              className={`rounded-xl border-2 ${BORDER[status]} bg-background p-4 space-y-3 hover:bg-muted/30 transition-colors block`}
            >
              <div className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{room.nameAr}</p>
                  <p className="text-xs text-muted-foreground">{room.nameEn}</p>
                  <p className="text-xs text-muted-foreground font-mono">{room.code}</p>
                </div>
                {!room.isActive && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">Inactive</span>
                )}
              </div>
              <OccupancyBar pct={pct} warning={thresholds.warning} critical={thresholds.critical} />
              <p className="text-xs text-muted-foreground">
                {room.currentUse} / {room.capacity} boxes · click to drill down
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
