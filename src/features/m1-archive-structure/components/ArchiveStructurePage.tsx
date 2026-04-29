'use client';

import { useState } from 'react';
import { Warehouse, LayoutGrid, TreePine } from 'lucide-react';
import { OccupancyDashboard } from './OccupancyDashboard';
import { ArchiveTree } from './ArchiveTree';
import { useArchiveModule } from '../hooks';
import { useAppDispatch } from '@/store/hooks';
import { addRoom, addShelf, transferBox } from '../store/slice';

type View = 'dashboard' | 'tree';

export function ArchiveStructurePage() {
  const dispatch = useAppDispatch();
  const { cabinets, boxes } = useArchiveModule();
  const [view, setView] = useState<View>('dashboard');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newShelfCode, setNewShelfCode] = useState('');
  const [newShelfCabinetId, setNewShelfCabinetId] = useState(cabinets[0]?.id ?? '');
  const [transferBoxId, setTransferBoxId] = useState(boxes[0]?.id ?? '');
  const [transferShelfId, setTransferShelfId] = useState(cabinets[0]?.id ? '' : '');

  function createRoom() {
    if (!newRoomName.trim() || !newRoomCode.trim()) return;
    dispatch(
      addRoom({
        id: `rm-${Date.now()}`,
        name: newRoomName.trim(),
        code: newRoomCode.trim(),
        capacity: 100,
        isActive: true,
      })
    );
    setNewRoomName('');
    setNewRoomCode('');
  }

  function createShelf() {
    if (!newShelfCode.trim() || !newShelfCabinetId) return;
    dispatch(
      addShelf({
        id: `sh-${Date.now()}`,
        code: newShelfCode.trim(),
        cabinetId: newShelfCabinetId,
        capacity: 10,
        used: 0,
      })
    );
    setNewShelfCode('');
  }

  function transferSelectedBox() {
    if (!transferBoxId || !transferShelfId) return;
    dispatch(transferBox({ boxId: transferBoxId, toShelfId: transferShelfId }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Warehouse className="w-6 h-6 text-primary-a0" />
          <div>
            <h1 className="text-2xl font-bold">Archive Structure</h1>
            <p className="text-sm text-muted-foreground">إدارة القاعات والرفوف والصناديق</p>
          </div>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'dashboard' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Occupancy dashboard
          </button>
          <button
            onClick={() => setView('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'tree' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <TreePine className="w-4 h-4" />
            Structure tree
          </button>
        </div>
      </div>

      <section className="rounded-xl border bg-background p-4 grid lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add room</h2>
          <input value={newRoomName} onChange={(e)=>setNewRoomName(e.target.value)} placeholder="Room name" className="w-full h-9 rounded-md border px-3 text-sm" />
          <input value={newRoomCode} onChange={(e)=>setNewRoomCode(e.target.value)} placeholder="Room code (R04)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <button onClick={createRoom} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Add shelf</h2>
          <input value={newShelfCode} onChange={(e)=>setNewShelfCode(e.target.value)} placeholder="Shelf code" className="w-full h-9 rounded-md border px-3 text-sm" />
          <select value={newShelfCabinetId} onChange={(e)=>setNewShelfCabinetId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {cabinets.map((cab) => <option key={cab.id} value={cab.id}>{cab.code}</option>)}
          </select>
          <button onClick={createShelf} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">إضافة</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Transfer box</h2>
          <select value={transferBoxId} onChange={(e)=>setTransferBoxId(e.target.value)} className="w-full h-9 rounded-md border px-3 text-sm">
            {boxes.map((b) => <option key={b.id} value={b.id}>{b.code}</option>)}
          </select>
          <input value={transferShelfId} onChange={(e)=>setTransferShelfId(e.target.value)} placeholder="Target shelf id (sh-...)" className="w-full h-9 rounded-md border px-3 text-sm" />
          <button onClick={transferSelectedBox} className="h-9 px-3 rounded-md border text-sm hover:bg-muted">نقل</button>
        </div>
      </section>

      {view === 'dashboard' ? <OccupancyDashboard /> : <ArchiveTree />}
    </div>
  );
}
