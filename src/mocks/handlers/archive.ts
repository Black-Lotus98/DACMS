import { http, HttpResponse } from 'msw';
import { roomsSeed, rowsSeed, cabinetsSeed, shelvesSeed, boxesSeed } from '@/features/m1-archive-structure/data';

export const archiveHandlers = [
  http.get('/api/rooms', () => HttpResponse.json(roomsSeed)),
  http.get('/api/rows', () => HttpResponse.json(rowsSeed)),
  http.get('/api/cabinets', () => HttpResponse.json(cabinetsSeed)),
  http.get('/api/shelves', () => HttpResponse.json(shelvesSeed)),
  http.get('/api/boxes', () => HttpResponse.json(boxesSeed)),
  http.get('/api/archive/tree', () =>
    HttpResponse.json({
      rooms: roomsSeed,
      rows: rowsSeed,
      cabinets: cabinetsSeed,
      shelves: shelvesSeed,
      boxes: boxesSeed,
    })
  ),
];
