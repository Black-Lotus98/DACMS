import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ArchiveBox, ArchiveRoom, ArchiveShelf, ArchiveStructureState } from '../types';
import { boxesSeed, cabinetsSeed, roomsSeed, rowsSeed, shelvesSeed } from '../data';

const initialState: ArchiveStructureState = {
  rooms: roomsSeed,
  rows: rowsSeed,
  cabinets: cabinetsSeed,
  shelves: shelvesSeed,
  boxes: boxesSeed,
};

const archiveStructureSlice = createSlice({
  name: 'archiveStructure',
  initialState,
  reducers: {
    addRoom(state, action: PayloadAction<ArchiveRoom>) {
      state.rooms.push(action.payload);
    },
    addShelf(state, action: PayloadAction<ArchiveShelf>) {
      state.shelves.push(action.payload);
    },
    transferBox(state, action: PayloadAction<{ boxId: string; toShelfId: string }>) {
      const box = state.boxes.find((b) => b.id === action.payload.boxId);
      if (!box || box.isSealed) return;
      box.shelfId = action.payload.toShelfId;
    },
    sealBox(state, action: PayloadAction<string>) {
      const box = state.boxes.find((b) => b.id === action.payload);
      if (box) box.isSealed = true;
    },
    updateShelfUsed(state, action: PayloadAction<{ shelfId: string; used: number }>) {
      const shelf = state.shelves.find((s) => s.id === action.payload.shelfId);
      if (shelf) shelf.used = action.payload.used;
    },
  },
});

export const { addRoom, addShelf, transferBox, sealBox, updateShelfUsed } = archiveStructureSlice.actions;
export default archiveStructureSlice.reducer;
