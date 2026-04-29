'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useArchiveModule } from '../hooks';

export function ArchiveRoomDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getRoomById, getRowsByRoomId, getCabsByRowIds, getShelvesByCabIds, getBoxesByShelfIds } = useArchiveModule();

  const room = getRoomById(id);

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
  const cabinets = getCabsByRowIds(rows.map((r) => r.id));
  const shelves = getShelvesByCabIds(cabinets.map((c) => c.id));
  const boxes = getBoxesByShelfIds(shelves.map((s) => s.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Room view: {room.name}</h1>
          <p className="text-sm text-muted-foreground">Code: {room.code}</p>
        </div>
        <Link href={`/${local}/archive-structure`} className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-muted">
          Back to archive structure
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold mb-2">Room summary</h2>
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          <div className="border rounded-md p-2">Rows: {rows.length}</div>
          <div className="border rounded-md p-2">Cabinets: {cabinets.length}</div>
          <div className="border rounded-md p-2">Shelves: {shelves.length}</div>
          <div className="border rounded-md p-2">Boxes: {boxes.length}</div>
        </div>
      </section>
    </div>
  );
}
