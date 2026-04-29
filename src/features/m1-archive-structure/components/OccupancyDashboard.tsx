'use client';

import { Warehouse } from 'lucide-react';
import { useArchiveModule } from '../hooks';
import { OccupancyBar } from './OccupancyBar';

export function OccupancyDashboard() {
  const { rooms, roomOccupancy } = useArchiveModule();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => {
        const occ = roomOccupancy.find((o) => o.roomId === room.id);
        const pct = occ?.pct ?? 0;
        const border =
          pct >= 90
            ? 'border-red-400'
            : pct >= 70
            ? 'border-amber-400'
            : 'border-green-400';

        return (
          <div
            key={room.id}
            className={`rounded-xl border-2 ${border} bg-background p-4 space-y-3`}
          >
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold text-sm">{room.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{room.code}</p>
              </div>
            </div>
            <OccupancyBar pct={pct} />
          </div>
        );
      })}
    </div>
  );
}
