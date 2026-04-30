'use client';

import { Warehouse } from 'lucide-react';
import { useArchiveModule } from '../hooks';
import { OccupancyBar } from './OccupancyBar';

const BORDER: Record<'normal' | 'warning' | 'critical', string> = {
  normal:   'border-green-400',
  warning:  'border-amber-400',
  critical: 'border-red-400',
};

export function OccupancyDashboard() {
  const { rooms, roomOccupancy, getOccupancyStatus } = useArchiveModule();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => {
        const pct = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;
        const status = getOccupancyStatus(pct);

        return (
          <div key={room.id} className={`rounded-xl border-2 ${BORDER[status]} bg-background p-4 space-y-3`}>
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{room.nameAr}</p>
                <p className="text-xs text-muted-foreground font-mono">{room.code}</p>
              </div>
              {!room.isActive && (
                <span className="ms-auto text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">Inactive</span>
              )}
            </div>
            <OccupancyBar pct={pct} />
          </div>
        );
      })}
    </div>
  );
}
