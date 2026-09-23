import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockTownships, type Township } from "@/lib/mock/townships";

interface TownshipsState {
  items: Township[];
}

const initialState: TownshipsState = {
  items: mockTownships,
};

const townshipsSlice = createSlice({
  name: "townships",
  initialState,
  reducers: {
    addTownship(state, action: PayloadAction<Township>) {
      state.items.unshift(action.payload);
    },
    updateTownship(state, action: PayloadAction<{ id: string; changes: Partial<Township> }>) {
      const township = state.items.find((t) => t.id === action.payload.id);
      if (township) Object.assign(township, action.payload.changes);
    },
    deleteTownship(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTownship, updateTownship, deleteTownship } = townshipsSlice.actions;
export default townshipsSlice.reducer;
