import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockListings, type Listing, type ListingStatus } from "@/lib/mock/listings";

interface ListingsState {
  items: Listing[];
}

const initialState: ListingsState = {
  items: mockListings,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    addListing(state, action: PayloadAction<Listing>) {
      state.items.unshift(action.payload);
    },
    updateListing(state, action: PayloadAction<{ id: string; changes: Partial<Listing> }>) {
      const listing = state.items.find((l) => l.id === action.payload.id);
      if (listing) Object.assign(listing, action.payload.changes);
    },
    deleteListing(state, action: PayloadAction<string>) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    deleteListings(state, action: PayloadAction<string[]>) {
      state.items = state.items.filter((l) => !action.payload.includes(l.id));
    },
    setListingStatus(state, action: PayloadAction<{ id: string; status: ListingStatus }>) {
      const listing = state.items.find((l) => l.id === action.payload.id);
      if (listing) listing.status = action.payload.status;
    },
    setListingsStatus(state, action: PayloadAction<{ ids: string[]; status: ListingStatus }>) {
      state.items.forEach((l) => {
        if (action.payload.ids.includes(l.id)) l.status = action.payload.status;
      });
    },
    toggleListingActive(state, action: PayloadAction<string>) {
      const listing = state.items.find((l) => l.id === action.payload);
      if (listing) listing.isActive = !listing.isActive;
    },
  },
});

export const {
  addListing,
  updateListing,
  deleteListing,
  deleteListings,
  setListingStatus,
  setListingsStatus,
  toggleListingActive,
} = listingsSlice.actions;
export default listingsSlice.reducer;
