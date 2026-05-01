'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useArchiveModule } from '../hooks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleRoomActive, toggleRowActive,
  toggleCabinetActive, toggleShelfActive, toggleBoxActive,
} from '../store/slice';
import { OccupancyBar } from './OccupancyBar';

function statusColor(pct: number, warning: number, critical: number) {
  if (pct >= critical) return 'text-red-500';
  if (pct >= warning)  return 'text-amber-500';
  return 'text-green-600';
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

export function ArchiveRoomDetailPage() {
  const dispatch     = useAppDispatch();
  const { local, id } = useParams<{ local: string; id: string }>();
  const {
    getRoomById, getRowsByRoomId, getCabsByRowId,
    getShelvesByCabinetId, getBoxesByShelfId,
    shelfOccupancy, getOccupancyStatus, roomOccupancy, thresholds,
  } = useArchiveModule();
  const departments = useAppSelector((s) => s.org.departments);

  const room = getRoomById(id);
  const [openRows,    setOpenRows]    = useState<Set<string>>(new Set());
  const [openCabs,    setOpenCabs]    = useState<Set<string>>(new Set());
  const [openShelves, setOpenShelves] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setter(next);
  };

  if (!room) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          ← Archive Structure
        </Link>
      </div>
    );
  }

  const rows   = getRowsByRoomId(room.id);
  const roomPct = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;

  // F1.2: resolve department names
  const linkedDepts = room.deptIds.length > 0
    ? room.deptIds.map((id) => departments.find((d) => d.id === id)?.nameEn ?? id).join(', ')
    : '—';

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
            className="h-9 px-3 rounded-md border text-sm hover:bg-muted"
          >
            {room.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
            ← Back
          </Link>
        </div>
      </div>

      {/* Room info */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <h2 className="font-semibold text-sm">Room details</h2>
        <div className="grid sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Code</p>
            <p className="font-mono font-medium">{room.code}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Status</p>
            <span className={`font-medium ${room.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {room.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground mb-0.5">Linked departments (F1.2)</p>
            <p>{linkedDepts}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Occupancy</span>
            <span className={statusColor(roomPct, thresholds.warning, thresholds.critical)}>
              {roomPct}% ({room.currentUse} / {room.capacity} boxes)
            </span>
          </div>
          <OccupancyBar pct={roomPct} warning={thresholds.warning} critical={thresholds.critical} />
          {getOccupancyStatus(roomPct) === 'critical' && (
            <p className="text-xs text-red-600 font-medium">⚠ Critical — at or above {thresholds.critical}% capacity.</p>
          )}
          {getOccupancyStatus(roomPct) === 'warning' && (
            <p className="text-xs text-amber-600 font-medium">⚠ Warning — at or above {thresholds.warning}% capacity.</p>
          )}
        </div>
        {room.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
            <p className="text-sm">{room.notes}</p>
          </div>
        )}
      </section>

      {/* Hierarchy drill-down (F1.8 toggles at every level) */}
      <section className="rounded-xl border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold text-sm">Physical hierarchy ({rows.length} rows)</h2>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No rows defined for this room yet.</p>
        ) : (
          <div>
            {rows.map((row) => {
              const rowOpen  = openRows.has(row.id);
              const cabs     = getCabsByRowId(row.id);

              return (
                <div key={row.id} className="border-b last:border-b-0">
                  {/* Row header */}
                  <div className="flex items-center gap-1 px-4 py-2 hover:bg-muted/40">
                    <button
                      onClick={() => toggle(openRows, row.id, setOpenRows)}
                      className="flex items-center gap-2 flex-1 text-sm text-start"
                    >
                      {rowOpen
                        ? <ChevronDown  className="w-4 h-4 text-muted-foreground shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                      <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{row.code}</span>
                      <span className="flex-1">Row {row.position}</span>
                      <span className="text-xs text-muted-foreground">{cabs.length} cabinets</span>
                    </button>
                    <ActiveBadge isActive={row.isActive} />
                    <button
                      onClick={() => dispatch(toggleRowActive(row.id))}
                      className="text-xs text-muted-foreground hover:underline ml-2 shrink-0"
                    >
                      {row.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  {rowOpen && cabs.map((cab) => {
                    const cabOpen  = openCabs.has(cab.id);
                    const cabShelves = getShelvesByCabinetId(cab.id);

                    return (
                      <div key={cab.id}>
                        {/* Cabinet header */}
                        <div className="flex items-center gap-1 px-4 py-2 hover:bg-muted/40" style={{ paddingInlineStart: '2.5rem' }}>
                          <button
                            onClick={() => toggle(openCabs, cab.id, setOpenCabs)}
                            className="flex items-center gap-2 flex-1 text-sm text-start"
                          >
                            {cabOpen
                              ? <ChevronDown  className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                            <span className="font-mono text-xs text-muted-foreground w-36 shrink-0">{cab.code}</span>
                            <span className="flex-1">Cabinet</span>
                            <span className="text-xs text-muted-foreground">{cabShelves.length} shelves</span>
                          </button>
                          <ActiveBadge isActive={cab.isActive} />
                          <button
                            onClick={() => dispatch(toggleCabinetActive(cab.id))}
                            className="text-xs text-muted-foreground hover:underline ml-2 shrink-0"
                          >
                            {cab.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>

                        {cabOpen && cabShelves.map((shelf) => {
                          const shelfOpen = openShelves.has(shelf.id);
                          const shelfBoxes = getBoxesByShelfId(shelf.id);
                          const shelfPct   = shelfOccupancy.find((o) => o.shelfId === shelf.id)?.pct ?? 0;

                          return (
                            <div key={shelf.id}>
                              {/* Shelf header */}
                              <div className="flex items-center gap-1 py-2 hover:bg-muted/40" style={{ paddingInlineStart: '4rem' }}>
                                <button
                                  onClick={() => toggle(openShelves, shelf.id, setOpenShelves)}
                                  className="flex items-center gap-2 flex-1 text-sm text-start"
                                >
                                  {shelfOpen
                                    ? <ChevronDown  className="w-3 h-3 text-muted-foreground shrink-0" />
                                    : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                                  <span className="font-mono text-xs text-muted-foreground w-40 shrink-0">{shelf.code}</span>
                                  <div className="flex-1 max-w-32">
                                    <OccupancyBar pct={shelfPct} showLabel={false} warning={thresholds.warning} critical={thresholds.critical} />
                                  </div>
                                  <span className={`text-xs shrink-0 ms-2 ${statusColor(shelfPct, thresholds.warning, thresholds.critical)}`}>{shelfPct}%</span>
                                  <span className="text-xs text-muted-foreground shrink-0 ms-2">{shelfBoxes.length} boxes</span>
                                </button>
                                <ActiveBadge isActive={shelf.isActive} />
                                <button
                                  onClick={() => dispatch(toggleShelfActive(shelf.id))}
                                  className="text-xs text-muted-foreground hover:underline ml-2 shrink-0 mr-2"
                                >
                                  {shelf.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>

                              {/* Boxes */}
                              {shelfOpen && (
                                <div className="py-1 space-y-0.5" style={{ paddingInlineStart: '5.5rem', paddingInlineEnd: '1rem' }}>
                                  {shelfBoxes.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-1">No boxes</p>
                                  ) : shelfBoxes.map((box) => (
                                    <div key={box.id} className="flex items-center gap-2 py-1 text-xs">
                                      <span className="font-mono text-muted-foreground">{box.code}</span>
                                      <Link href={`/${local}/archive-structure/box/${box.id}`} className="text-muted-foreground hover:text-primary flex-1 hover:underline">
                                        {box.label}
                                      </Link>
                                      {box.isSealed  && <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">sealed</span>}
                                      <ActiveBadge isActive={box.isActive} />
                                      <button
                                        onClick={() => dispatch(toggleBoxActive(box.id))}
                                        className="text-muted-foreground hover:underline"
                                      >
                                        {box.isActive ? 'Deactivate' : 'Activate'}
                                      </button>
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
