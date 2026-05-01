import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ArchiveBox, ArchiveCabinet, ArchiveRoom, ArchiveRow, ArchiveShelf, ArchiveStructureState, CapacityThresholds } from '../types';
import { boxesSeed, cabinetsSeed, roomsSeed, rowsSeed, shelvesSeed } from '../data';

const initialState: ArchiveStructureState = {
  rooms:      roomsSeed,
  rows:       rowsSeed,
  cabinets:   cabinetsSeed,
  shelves:    shelvesSeed,
  boxes:      boxesSeed,
  thresholds: { warning: 70, critical: 90 },
};

const archiveStructureSlice = createSlice({
  name: 'archiveStructure',
  initialState,
  reducers: {
    // --- Room ---
    addRoom(state, action: PayloadAction<ArchiveRoom>) {
      state.rooms.push(action.payload);
    },
    updateRoom(state, action: PayloadAction<ArchiveRoom>) {
      const idx = state.rooms.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.rooms[idx] = action.payload;
    },

    // --- Row ---
    addRow(state, action: PayloadAction<ArchiveRow>) {
      state.rows.push(action.payload);
    },
    updateRow(state, action: PayloadAction<ArchiveRow>) {
      const idx = state.rows.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.rows[idx] = action.payload;
    },

    // --- Cabinet ---
    addCabinet(state, action: PayloadAction<ArchiveCabinet>) {
      state.cabinets.push(action.payload);
    },
    updateCabinet(state, action: PayloadAction<ArchiveCabinet>) {
      const idx = state.cabinets.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.cabinets[idx] = action.payload;
    },

    // --- Shelf ---
    addShelf(state, action: PayloadAction<ArchiveShelf>) {
      state.shelves.push(action.payload);
    },
    updateShelf(state, action: PayloadAction<ArchiveShelf>) {
      const idx = state.shelves.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.shelves[idx] = action.payload;
    },
    updateShelfUsed(state, action: PayloadAction<{ shelfId: string; used: number }>) {
      const shelf = state.shelves.find((s) => s.id === action.payload.shelfId);
      if (shelf) shelf.used = action.payload.used;
    },

    // --- Box ---
    addBox(state, action: PayloadAction<ArchiveBox>) {
      state.boxes.push(action.payload);
    },
    updateBox(state, action: PayloadAction<ArchiveBox>) {
      const idx = state.boxes.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state.boxes[idx] = action.payload;
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
    unsealBox(state, action: PayloadAction<string>) {
      const box = state.boxes.find((b) => b.id === action.payload);
      if (box) box.isSealed = false;
    },

    // --- F1.8: Activate / Deactivate any unit ---
    toggleRoomActive(state, action: PayloadAction<string>) {
      const room = state.rooms.find((r) => r.id === action.payload);
      if (room) room.isActive = !room.isActive;
    },
    toggleRowActive(state, action: PayloadAction<string>) {
      const row = state.rows.find((r) => r.id === action.payload);
      if (row) row.isActive = !row.isActive;
    },
    toggleCabinetActive(state, action: PayloadAction<string>) {
      const cabinet = state.cabinets.find((c) => c.id === action.payload);
      if (cabinet) cabinet.isActive = !cabinet.isActive;
    },
    toggleShelfActive(state, action: PayloadAction<string>) {
      const shelf = state.shelves.find((s) => s.id === action.payload);
      if (shelf) shelf.isActive = !shelf.isActive;
    },
    toggleBoxActive(state, action: PayloadAction<string>) {
      const box = state.boxes.find((b) => b.id === action.payload);
      if (box) box.isActive = !box.isActive;
    },

    // --- F1.10: configurable thresholds ---
    updateThresholds(state, action: PayloadAction<CapacityThresholds>) {
      state.thresholds = action.payload;
    },
  },
});

export const {
  addRoom, updateRoom,
  addRow, updateRow,
  addCabinet, updateCabinet,
  addShelf, updateShelf, updateShelfUsed,
  addBox, updateBox, transferBox, sealBox, unsealBox,
  toggleRoomActive, toggleRowActive, toggleCabinetActive, toggleShelfActive, toggleBoxActive,
  updateThresholds,
} = archiveStructureSlice.actions;

export default archiveStructureSlice.reducer;
