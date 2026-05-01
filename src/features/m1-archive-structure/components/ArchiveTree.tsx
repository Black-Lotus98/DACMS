'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Box, Layers } from 'lucide-react';
import { useArchiveModule } from '../hooks';
import { OccupancyBar } from './OccupancyBar';
import type { ArchiveCabinet, ArchiveRow, ArchiveShelf } from '../types';

function ShelfRow({ shelf, boxes }: { shelf: ArchiveShelf; boxes: { shelfId: string }[] }) {
  const boxCount = boxes.filter((b) => b.shelfId === shelf.id).length;
  const pct = Math.round((shelf.used / shelf.capacity) * 100);
  return (
    <div className="flex items-center gap-3 py-1.5 px-3 text-xs" style={{ paddingInlineStart: '80px' }}>
      <span className="font-mono text-muted-foreground w-28 shrink-0">{shelf.code}</span>
      <div className="flex-1"><OccupancyBar pct={pct} showLabel={false} /></div>
      <span className="text-muted-foreground shrink-0">{boxCount} boxes</span>
    </div>
  );
}

function CabinetNode({ cab, shelves, boxes }: { cab: ArchiveCabinet; shelves: ArchiveShelf[]; boxes: { shelfId: string }[] }) {
  const [open, setOpen] = useState(false);
  const cabShelves = shelves.filter((s) => s.cabinetId === cab.id);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-1.5 px-3 text-xs hover:bg-muted text-start"
        style={{ paddingInlineStart: '52px' }}
      >
        {open ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
        <Box className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="font-mono">{cab.code}</span>
        <span className="text-muted-foreground">({cabShelves.length} shelves)</span>
      </button>
      {open && cabShelves.map((sh) => <ShelfRow key={sh.id} shelf={sh} boxes={boxes} />)}
    </div>
  );
}

function RowNode({ row, cabinets, shelves, boxes }: { row: ArchiveRow; cabinets: ArchiveCabinet[]; shelves: ArchiveShelf[]; boxes: { shelfId: string }[] }) {
  const [open, setOpen] = useState(false);
  const rowCabs = cabinets.filter((c) => c.rowId === row.id);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-1.5 px-3 text-xs hover:bg-muted text-start"
        style={{ paddingInlineStart: '28px' }}
      >
        {open ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
        <Layers className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="font-mono">{row.code}</span>
        <span className="text-muted-foreground">({rowCabs.length} cabinets)</span>
      </button>
      {open && rowCabs.map((cab) => (
        <CabinetNode key={cab.id} cab={cab} shelves={shelves} boxes={boxes} />
      ))}
    </div>
  );
}

export function ArchiveTree() {
  const { rooms, rows, cabinets, shelves, boxes, roomOccupancy, thresholds } = useArchiveModule();
  const [openRooms, setOpenRooms] = useState<Set<string>>(new Set(['rm1']));

  const toggle = (id: string) =>
    setOpenRooms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div className="rounded-xl border bg-background overflow-hidden space-y-0">
      {rooms.map((room) => {
        const open = openRooms.has(room.id);
        const occ = roomOccupancy.find((o) => o.roomId === room.id);
        const pct = occ?.pct ?? 0;
        const roomRows = rows.filter((r) => r.roomId === room.id);

        return (
          <div key={room.id} className="border-b last:border-b-0">
            <button
              onClick={() => toggle(room.id)}
              className="w-full flex items-center gap-2 p-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
            >
              {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <span className="flex-1 text-start">{room.nameAr}</span>
              <span className="text-xs font-mono text-muted-foreground font-normal">{room.code}</span>
              <span className={`text-xs font-normal ms-2 ${pct >= thresholds.critical ? 'text-red-500' : pct >= thresholds.warning ? 'text-amber-500' : 'text-green-600'}`}>
                {pct}%
              </span>
            </button>
            {open && (
              <div className="border-t pb-2">
                {roomRows.map((row) => (
                  <RowNode key={row.id} row={row} cabinets={cabinets} shelves={shelves} boxes={boxes} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
