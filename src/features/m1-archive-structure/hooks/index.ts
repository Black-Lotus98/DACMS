import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useArchiveModule() {
  const { rooms, rows, cabinets, shelves, boxes, thresholds } = useAppSelector(
    (s) => s.archiveStructure
  );
  const { warning, critical } = thresholds;

  const roomOccupancy = useMemo(() =>
    rooms.map((room) => {
      const roomRows  = rows.filter((r) => r.roomId === room.id);
      const rowIds    = roomRows.map((r) => r.id);
      const cabIds    = cabinets.filter((c) => rowIds.includes(c.rowId)).map((c) => c.id);
      const roomShelves = shelves.filter((s) => cabIds.includes(s.cabinetId));
      const totalCap  = roomShelves.reduce((sum, s) => sum + s.capacity, 0);
      const totalUsed = roomShelves.reduce((sum, s) => sum + s.used, 0);
      const pct = totalCap > 0 ? Math.round((totalUsed / totalCap) * 100) : 0;
      return { roomId: room.id, pct };
    }),
  [rooms, rows, cabinets, shelves]);

  const shelfOccupancy = useMemo(() =>
    shelves.map((shelf) => {
      const pct = shelf.capacity > 0 ? Math.round((shelf.used / shelf.capacity) * 100) : 0;
      return { shelfId: shelf.id, pct };
    }),
  [shelves]);

  const getOccupancyStatus = (pct: number): 'normal' | 'warning' | 'critical' =>
    pct >= critical ? 'critical' : pct >= warning ? 'warning' : 'normal';

  return {
    rooms, rows, cabinets, shelves, boxes,
    thresholds,
    roomOccupancy, shelfOccupancy,

    getRoomById:          (id: string) => rooms.find((r) => r.id === id) ?? null,
    getRowById:           (id: string) => rows.find((r) => r.id === id) ?? null,
    getCabinetById:       (id: string) => cabinets.find((c) => c.id === id) ?? null,
    getShelfById:         (id: string) => shelves.find((s) => s.id === id) ?? null,
    getBoxById:           (id: string) => boxes.find((b) => b.id === id) ?? null,

    getRowsByRoomId:       (roomId: string)    => rows.filter((r) => r.roomId === roomId),
    getCabsByRowId:        (rowId: string)     => cabinets.filter((c) => c.rowId === rowId),
    getCabsByRowIds:       (rowIds: string[])  => cabinets.filter((c) => rowIds.includes(c.rowId)),
    getShelvesByCabinetId: (cabinetId: string) => shelves.filter((s) => s.cabinetId === cabinetId),
    getShelvesByCabIds:    (cabIds: string[])  => shelves.filter((s) => cabIds.includes(s.cabinetId)),
    getBoxesByShelfId:     (shelfId: string)   => boxes.filter((b) => b.shelfId === shelfId),
    getBoxesByShelfIds:    (shelfIds: string[])=> boxes.filter((b) => shelfIds.includes(b.shelfId)),

    getOccupancyStatus,
  };
}
