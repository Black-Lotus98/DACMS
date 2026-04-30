'use client';

import { useState } from 'react';
import { Warehouse, LayoutGrid, TreePine } from 'lucide-react';
import { OccupancyDashboard } from './OccupancyDashboard';
import { ArchiveTree } from './ArchiveTree';
import { useArchiveModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { addRoom, addRow, addCabinet, addShelf, addBox, transferBox } from '../store/slice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type View = 'dashboard' | 'tree';
type Panel = 'room' | 'row' | 'cabinet' | 'shelf' | 'box' | 'transfer';

const INPUT = 'w-full h-9 rounded-md border px-3 text-sm';
const BTN = 'h-9 px-3 rounded-md border text-sm hover:bg-muted';

export function ArchiveStructurePage() {
  const dispatch = useAppDispatch();
  const { rooms, rows, cabinets, shelves, boxes, roomOccupancy, getOccupancyStatus } = useArchiveModule();
  const { local } = useParams<{ local: string }>();
  const [view, setView] = useState<View>('dashboard');
  const [panel, setPanel] = useState<Panel>('room');

  // Room
  const [roomNameAr, setRoomNameAr] = useState('');
  const [roomNameEn, setRoomNameEn] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('100');

  // Row
  const [rowRoomId, setRowRoomId] = useState(rooms[0]?.id ?? '');
  const [rowPosition, setRowPosition] = useState('');
  const [rowCapacity, setRowCapacity] = useState('2');

  // Cabinet
  const [cabRowId, setCabRowId] = useState(rows[0]?.id ?? '');
  const [cabShelfCount, setCabShelfCount] = useState('4');

  // Shelf
  const [shelfCabinetId, setShelfCabinetId] = useState(cabinets[0]?.id ?? '');
  const [shelfCapacity, setShelfCapacity] = useState('10');

  // Box
  const [boxShelfId, setBoxShelfId] = useState(shelves[0]?.id ?? '');
  const [boxLabel, setBoxLabel] = useState('');

  // Transfer
  const [transferBoxId, setTransferBoxId] = useState(boxes[0]?.id ?? '');
  const [transferToShelfId, setTransferToShelfId] = useState(shelves[0]?.id ?? '');

  function createRoom() {
    if (!roomNameAr.trim() || !roomNameEn.trim() || !roomCode.trim()) return;
    dispatch(addRoom({
      id: `rm-${Date.now()}`,
      nameAr: roomNameAr.trim(),
      nameEn: roomNameEn.trim(),
      code: roomCode.trim(),
      capacity: Math.max(1, Number(roomCapacity) || 100),
      currentUse: 0,
      deptIds: [],
      isActive: true,
    }));
    setRoomNameAr(''); setRoomNameEn(''); setRoomCode(''); setRoomCapacity('100');
  }

  function createRow() {
    if (!rowRoomId || !rowPosition) return;
    const room = rooms.find((r) => r.id === rowRoomId);
    if (!room) return;
    const pos = Number(rowPosition);
    dispatch(addRow({
      id: `rw-${Date.now()}`,
      code: `${room.code}-RW${String(pos).padStart(2, '0')}`,
      roomId: rowRoomId,
      position: pos,
      capacity: Math.max(1, Number(rowCapacity) || 2),
      isActive: true,
    }));
    setRowPosition('');
  }

  function createCabinet() {
    if (!cabRowId) return;
    const row = rows.find((r) => r.id === cabRowId);
    if (!row) return;
    const existingCount = cabinets.filter((c) => c.rowId === cabRowId).length + 1;
    dispatch(addCabinet({
      id: `cb-${Date.now()}`,
      code: `${row.code}-CB${String(existingCount).padStart(2, '0')}`,
      rowId: cabRowId,
      shelfCount: Math.max(1, Number(cabShelfCount) || 4),
      isActive: true,
    }));
  }

  function createShelf() {
    if (!shelfCabinetId) return;
    const cab = cabinets.find((c) => c.id === shelfCabinetId);
    if (!cab) return;
    const existingCount = shelves.filter((s) => s.cabinetId === shelfCabinetId).length + 1;
    dispatch(addShelf({
      id: `sh-${Date.now()}`,
      code: `${cab.code}-SH${existingCount}`,
      cabinetId: shelfCabinetId,
      capacity: Math.max(1, Number(shelfCapacity) || 10),
      used: 0,
      isActive: true,
    }));
  }

  function createBox() {
    if (!boxShelfId || !boxLabel.trim()) return;
    const shelf = shelves.find((s) => s.id === boxShelfId);
    if (!shelf) return;
    const existingCount = boxes.filter((b) => b.shelfId === boxShelfId).length + 1;
    dispatch(addBox({
      id: `bx-${Date.now()}`,
      code: `${shelf.code}-BX${existingCount}`,
      label: boxLabel.trim(),
      shelfId: boxShelfId,
      recordIds: [],
      isSealed: false,
      isActive: true,
    }));
    setBoxLabel('');
  }

  function doTransferBox() {
    if (!transferBoxId || !transferToShelfId) return;
    dispatch(transferBox({ boxId: transferBoxId, toShelfId: transferToShelfId }));
  }

  const PANELS: { key: Panel; label: string }[] = [
    { key: 'room',     label: 'Room' },
    { key: 'row',      label: 'Row' },
    { key: 'cabinet',  label: 'Cabinet' },
    { key: 'shelf',    label: 'Shelf' },
    { key: 'box',      label: 'Box' },
    { key: 'transfer', label: 'Transfer box' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Warehouse className="w-6 h-6 text-primary-a0" />
          <div>
            <h1 className="text-2xl font-bold">Archive Structure</h1>
            <p className="text-sm text-muted-foreground">Manage rooms, rows, cabinets, shelves, and boxes.</p>
          </div>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'dashboard' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Occupancy
          </button>
          <button
            onClick={() => setView('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'tree' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <TreePine className="w-4 h-4" />
            Tree
          </button>
        </div>
      </div>

      {/* Add panel */}
      <section className="rounded-xl border bg-background p-4 space-y-4">
        <div className="flex flex-wrap gap-1">
          {PANELS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPanel(p.key)}
              className={`h-8 px-3 rounded-md text-sm transition-colors ${panel === p.key ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {panel === 'room' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <input value={roomNameAr} onChange={(e) => setRoomNameAr(e.target.value)} placeholder="اسم القاعة" dir="rtl" className={INPUT} />
            <input value={roomNameEn} onChange={(e) => setRoomNameEn(e.target.value)} placeholder="Room name (EN)" className={INPUT} />
            <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Code (e.g. R04)" className={INPUT} />
            <input type="number" min={1} value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} placeholder="Capacity" className={INPUT} />
            <button onClick={createRoom} className={BTN}>Add room</button>
          </div>
        )}

        {panel === 'row' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <select value={rowRoomId} onChange={(e) => setRowRoomId(e.target.value)} className={INPUT}>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.code} — {r.nameEn}</option>)}
            </select>
            <input type="number" min={1} value={rowPosition} onChange={(e) => setRowPosition(e.target.value)} placeholder="Position number" className={INPUT} />
            <input type="number" min={1} value={rowCapacity} onChange={(e) => setRowCapacity(e.target.value)} placeholder="Cabinet capacity" className={INPUT} />
            <button onClick={createRow} className={BTN}>Add row</button>
          </div>
        )}

        {panel === 'cabinet' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <select value={cabRowId} onChange={(e) => setCabRowId(e.target.value)} className={INPUT}>
              {rows.map((r) => <option key={r.id} value={r.id}>{r.code}</option>)}
            </select>
            <input type="number" min={1} value={cabShelfCount} onChange={(e) => setCabShelfCount(e.target.value)} placeholder="Shelf count" className={INPUT} />
            <button onClick={createCabinet} className={BTN}>Add cabinet</button>
          </div>
        )}

        {panel === 'shelf' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <select value={shelfCabinetId} onChange={(e) => setShelfCabinetId(e.target.value)} className={INPUT}>
              {cabinets.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
            <input type="number" min={1} value={shelfCapacity} onChange={(e) => setShelfCapacity(e.target.value)} placeholder="Box capacity" className={INPUT} />
            <button onClick={createShelf} className={BTN}>Add shelf</button>
          </div>
        )}

        {panel === 'box' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <select value={boxShelfId} onChange={(e) => setBoxShelfId(e.target.value)} className={INPUT}>
              {shelves.map((s) => <option key={s.id} value={s.id}>{s.code}</option>)}
            </select>
            <input value={boxLabel} onChange={(e) => setBoxLabel(e.target.value)} placeholder="Box label" className={INPUT} />
            <button onClick={createBox} className={BTN}>Add box</button>
          </div>
        )}

        {panel === 'transfer' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <select value={transferBoxId} onChange={(e) => setTransferBoxId(e.target.value)} className={INPUT}>
              {boxes.filter((b) => !b.isSealed).map((b) => <option key={b.id} value={b.id}>{b.code} — {b.label}</option>)}
            </select>
            <select value={transferToShelfId} onChange={(e) => setTransferToShelfId(e.target.value)} className={INPUT}>
              {shelves.map((s) => <option key={s.id} value={s.id}>{s.code}</option>)}
            </select>
            <button onClick={doTransferBox} className={BTN}>Transfer</button>
          </div>
        )}
      </section>

      {/* Quick room links */}
      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2 text-sm">Rooms</h2>
        <div className="flex flex-wrap gap-2">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/${local}/archive-structure/room/${room.id}`}
              className={`text-sm hover:underline ${room.isActive ? 'text-primary' : 'text-muted-foreground line-through'}`}
            >
              {room.nameAr}
            </Link>
          ))}
        </div>
      </section>

      {/* F1.10: Threshold alerts */}
      {rooms
        .filter((room) => {
          const pct = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;
          return getOccupancyStatus(pct) !== 'normal' && room.isActive;
        })
        .map((room) => {
          const pct = roomOccupancy.find((o) => o.roomId === room.id)?.pct ?? 0;
          const status = getOccupancyStatus(pct);
          return (
            <div
              key={room.id}
              className={`rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 ${status === 'critical' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}
            >
              <span className="font-medium">{status === 'critical' ? '🔴' : '🟡'} {room.nameAr}</span>
              <span>— {pct}% capacity {status === 'critical' ? '(critical)' : '(warning)'}</span>
            </div>
          );
        })}

      {view === 'dashboard' ? <OccupancyDashboard /> : <ArchiveTree />}
    </div>
  );
}
