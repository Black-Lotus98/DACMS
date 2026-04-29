export interface ArchiveRoom {
  id: string;
  code: string;
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface ArchiveRow {
  id: string;
  code: string;
  roomId: string;
}

export interface ArchiveCabinet {
  id: string;
  code: string;
  rowId: string;
}

export interface ArchiveShelf {
  id: string;
  code: string;
  cabinetId: string;
  capacity: number;
  used: number;
}

export interface ArchiveBox {
  id: string;
  code: string;
  shelfId: string;
  isSealed: boolean;
}

export interface ArchiveStructureState {
  rooms: ArchiveRoom[];
  rows: ArchiveRow[];
  cabinets: ArchiveCabinet[];
  shelves: ArchiveShelf[];
  boxes: ArchiveBox[];
}
