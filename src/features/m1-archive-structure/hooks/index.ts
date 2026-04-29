import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useArchiveModule() {
  const { rooms, rows, cabinets, shelves, boxes } = useAppSelector(
    (s) => s.archiveStructure
  );

  const roomOccupancy = useMemo(() =>
    rooms.map((room) => {
      const roomRows = rows.filter((r) => r.roomId === room.id);
      const rowIds = roomRows.map((r) => r.id);
      const cabIds = cabinets.filter((c) => rowIds.includes(c.rowId)).map((c) => c.id);
      const roomShelves = shelves.filter((s) => cabIds.includes(s.cabinetId));
      const totalCap = roomShelves.reduce((sum, s) => sum + s.capacity, 0);
      const totalUsed = roomShelves.reduce((sum, s) => sum + s.used, 0);
      const pct = totalCap > 0 ? Math.round((totalUsed / totalCap) * 100) : 0;
      return { roomId: room.id, pct };
    }),
  [rooms, rows, cabinets, shelves]);

  return {
    rooms,
    rows,
    cabinets,
    shelves,
    boxes,
    roomOccupancy,
    getRoomById: (id: string) => rooms.find((r) => r.id === id) ?? null,
    getRowsByRoomId: (roomId: string) => rows.filter((r) => r.roomId === roomId),
    getCabsByRowIds: (rowIds: string[]) => cabinets.filter((c) => rowIds.includes(c.rowId)),
    getShelvesByCabIds: (cabIds: string[]) => shelves.filter((s) => cabIds.includes(s.cabinetId)),
    getBoxesByShelfIds: (shelfIds: string[]) => boxes.filter((b) => shelfIds.includes(b.shelfId)),
    getShelfById: (id: string) => shelves.find((s) => s.id === id),
  };
}
