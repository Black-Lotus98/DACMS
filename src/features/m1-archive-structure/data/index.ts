import type { ArchiveBox, ArchiveCabinet, ArchiveRoom, ArchiveRow, ArchiveShelf } from '../types';

export const roomsSeed: ArchiveRoom[] = [
  {
    id: 'rm1', code: 'R01',
    nameAr: 'قاعة الأرشيف الرئيسية', nameEn: 'Main Archive Hall',
    capacity: 100, currentUse: 72, deptIds: ['dept-1', 'dept-2'], isActive: true,
  },
  {
    id: 'rm2', code: 'R02',
    nameAr: 'قاعة الوثائق التاريخية', nameEn: 'Historical Documents Hall',
    capacity: 80, currentUse: 45, deptIds: ['dept-3'], isActive: true,
  },
  {
    id: 'rm3', code: 'R03',
    nameAr: 'قاعة الأرشيف الفرعي', nameEn: 'Secondary Archive Hall',
    capacity: 60, currentUse: 10, deptIds: [], isActive: false,
    notes: 'Under renovation',
  },
];

export const rowsSeed: ArchiveRow[] = roomsSeed.flatMap((rm, ri) =>
  [1, 2, 3].map((r) => ({
    id: `rw-${ri + 1}-${r}`,
    code: `${rm.code}-RW0${r}`,
    roomId: rm.id,
    position: r,
    capacity: 2,
    isActive: true,
  }))
);

export const cabinetsSeed: ArchiveCabinet[] = rowsSeed.flatMap((rw, i) =>
  [1, 2].map((c) => ({
    id: `cb-${i}-${c}`,
    code: `${rw.code}-CB0${c}`,
    rowId: rw.id,
    shelfCount: 4,
    isActive: true,
  }))
);

const usedPattern = [3, 8, 10, 5, 7, 9, 4, 2, 10, 6, 8, 1, 9, 3, 7, 5, 10, 8, 4, 6, 2, 9, 7, 3];

export const shelvesSeed: ArchiveShelf[] = cabinetsSeed.flatMap((cb, i) =>
  [1, 2, 3, 4].map((s) => ({
    id: `sh-${i}-${s}`,
    code: `${cb.code}-SH${s}`,
    cabinetId: cb.id,
    capacity: 10,
    used: usedPattern[(i * 4 + s - 1) % usedPattern.length],
    isActive: true,
  }))
);

export const boxesSeed: ArchiveBox[] = shelvesSeed.flatMap((sh, i) =>
  [1, 2, 3, 4, 5].map((b) => ({
    id: `bx-${i}-${b}`,
    code: `${sh.code}-BX${b}`,
    label: `Box ${i + 1}-${b}`,
    shelfId: sh.id,
    recordIds: [],
    isSealed: b === 5,
    isActive: true,
  }))
);
