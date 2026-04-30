'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useArchiveModule, OCCUPANCY_WARNING, OCCUPANCY_CRITICAL } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { toggleRoomActive } from '../store/slice';
import { OccupancyBar } from './OccupancyBar';

function statusColor(pct: number) {
  if (pct >= OCCUPANCY_CRITICAL) return 'text-red-500';
  if (pct >= OCCUPANCY_WARNING) return 'text-amber-500';
  return 'text-green-600';
}

export function ArchiveRoomDetailPage() {
  const dispatch = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const {
    getRoomById,
    getRowsByRoomId,
    getCabsByRowId,
    getShelvesByCabinetId,
    getBoxesByShelfId,
    shelfOccupancy,
    getOccupancyStatus,
    roomOccupancy,
  } = useArchiveModule();

  const room = getRoomById(id);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [openCabs, setOpenCabs] = useState<Set<string>>(new Set());
  const [openShelves, setOpenShelves] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setter(next);
  };

  if (!room) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <p className="text-sm text-muted-foreground">This room id does not exist in the current archive structure.</p>
        <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to archive structure
        </Link>
      </div>
    );
  }

  const rows = getRowsByRoomId(room.id);
  const roomPct = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{room.nameAr}</h1>
          <p className="text-sm text-muted-foreground">{room.nameEn}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dispatch(toggleRoomActive(room.id))}
            className={`h-9 px-3 rounded-md border text-sm hover:bg-muted ${!room.isActive ? 'text-muted-foreground' : ''}`}
          >
            {room.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            Back
          </Link>
        </div>
      </div>

      {/* Room info */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <h2 className="font-semibold text-sm">Room details</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Code</p>
            <p className="font-mono font-medium">{room.code}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Status</p>
            <span className={`text-sm font-medium ${room.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {room.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Departments linked</p>
            <p>{room.deptIds.length > 0 ? room.deptIds.join(', ') : '—'}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Occupancy</span>
            <span className={statusColor(roomPct)}>{roomPct}% ({room.currentUse} / {room.capacity} boxes)</span>
          </div>
          <OccupancyBar pct={roomPct} />
          {getOccupancyStatus(roomPct) === 'critical' && (
            <p className="text-xs text-red-600 font-medium">⚠ Critical — at or above {OCCUPANCY_CRITICAL}% capacity.</p>
          )}
          {getOccupancyStatus(roomPct) === 'warning' && (
            <p className="text-xs text-amber-600 font-medium">⚠ Warning — at or above {OCCUPANCY_WARNING}% capacity.</p>
          )}
        </div>
        {room.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
            <p className="text-sm">{room.notes}</p>
          </div>
        )}
      </section>

      {/* Hierarchy drill-down */}
      <section className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold text-sm">Physical hierarchy ({rows.length} rows)</h2>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No rows defined for this room yet.</p>
        ) : (
          <div>
            {rows.map((row) => {
              const rowOpen = openRows.has(row.id);
              const cabinets = getCabsByRowId(row.id);

              return (
                <div key={row.id} className="border-b last:border-b-0">
                  {/* Row */}
                  <button
                    onClick={() => toggle(openRows, row.id, setOpenRows)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50 text-start"
                  >
                    {rowOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{row.code}</span>
                    <span className="flex-1">Row {row.position}</span>
                    <span className="text-xs text-muted-foreground">{cabinets.length} cabinets</span>
                  </button>

                  {rowOpen && cabinets.map((cab) => {
                    const cabOpen = openCabs.has(cab.id);
                    const shelves = getShelvesByCabinetId(cab.id);

                    return (
                      <div key={cab.id}>
                        {/* Cabinet */}
                        <button
                          onClick={() => toggle(openCabs, cab.id, setOpenCabs)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 text-start"
                          style={{ paddingInlineStart: '2.5rem' }}
                        >
                          {cabOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                          <span className="font-mono text-xs text-muted-foreground w-36 shrink-0">{cab.code}</span>
                          <span className="flex-1 text-sm">Cabinet</span>
                          <span className="text-xs text-muted-foreground">{shelves.length} shelves</span>
                        </button>

                        {cabOpen && shelves.map((shelf) => {
                          const shelfOpen = openShelves.has(shelf.id);
                          const boxes = getBoxesByShelfId(shelf.id);
                          const shelfPct = shelfOccupancy.find((o) => o.shelfId === shelf.id)?.pct ?? 0;

                          return (
                            <div key={shelf.id}>
                              {/* Shelf */}
                              <button
                                onClick={() => toggle(openShelves, shelf.id, setOpenShelves)}
                                className="w-full flex items-center gap-2 py-2 text-sm hover:bg-muted/50 text-start"
                                style={{ paddingInlineStart: '4rem' }}
                              >
                                {shelfOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                                <span className="font-mono text-xs text-muted-foreground w-40 shrink-0">{shelf.code}</span>
                                <div className="flex-1 max-w-32">
                                  <OccupancyBar pct={shelfPct} showLabel={false} />
                                </div>
                                <span className={`text-xs shrink-0 ms-2 ${statusColor(shelfPct)}`}>{shelfPct}%</span>
                                <span className="text-xs text-muted-foreground shrink-0 ms-2">{boxes.length} boxes</span>
                              </button>

                              {/* Boxes */}
                              {shelfOpen && (
                                <div className="py-1 space-y-0.5" style={{ paddingInlineStart: '5.5rem' }}>
                                  {boxes.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-1">No boxes</p>
                                  ) : boxes.map((box) => (
                                    <div key={box.id} className="flex items-center gap-2 py-1 text-xs">
                                      <span className="font-mono text-muted-foreground">{box.code}</span>
                                      <span className="text-muted-foreground">{box.label}</span>
                                      {box.isSealed && <span className="px-1 rounded bg-muted text-muted-foreground">sealed</span>}
                                      {!box.isActive && <span className="px-1 rounded bg-red-100 text-red-600">inactive</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
