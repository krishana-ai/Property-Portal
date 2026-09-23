import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockProperties, type CanonicalProperty } from "@/lib/mock/properties";

interface PropertiesState {
  items: CanonicalProperty[];
}

const initialState: PropertiesState = {
  items: mockProperties,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    addProperty(state, action: PayloadAction<CanonicalProperty>) {
      state.items.unshift(action.payload);
    },
    updateProperty(state, action: PayloadAction<{ id: string; changes: Partial<CanonicalProperty> }>) {
      const property = state.items.find((p) => p.id === action.payload.id);
      if (property) Object.assign(property, action.payload.changes);
    },
    deleteProperty(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    mergeProperties(state, action: PayloadAction<{ sourceId: string; targetId: string }>) {
      const { sourceId, targetId } = action.payload;
      const source = state.items.find((p) => p.id === sourceId);
      const target = state.items.find((p) => p.id === targetId);
      if (source && target) {
        target.linkedListings = [...target.linkedListings, ...source.linkedListings];
      }
      state.items = state.items.filter((p) => p.id !== sourceId);
    },
  },
});

export const { addProperty, updateProperty, deleteProperty, mergeProperties } = propertiesSlice.actions;
export default propertiesSlice.reducer;
