export interface ArchiveRoom {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  capacity: number;
  currentUse: number;
  deptIds: string[];
  isActive: boolean;
  notes?: string;
}

export interface ArchiveRow {
  id: string;
  code: string;
  roomId: string;
  position: number;
  capacity: number;
  isActive: boolean;
}

export interface ArchiveCabinet {
  id: string;
  code: string;
  rowId: string;
  shelfCount: number;
  isActive: boolean;
}

export interface ArchiveShelf {
  id: string;
  code: string;
  cabinetId: string;
  capacity: number;
  used: number;
  isActive: boolean;
}

export interface ArchiveBox {
  id: string;
  code: string;
  label: string;
  shelfId: string;
  recordIds: string[];
  isSealed: boolean;
  isActive: boolean;
}

export interface ArchiveStructureState {
  rooms: ArchiveRoom[];
  rows: ArchiveRow[];
  cabinets: ArchiveCabinet[];
  shelves: ArchiveShelf[];
  boxes: ArchiveBox[];
}
