import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsState {
  items: AppNotification[];
}

const initialState: NotificationsState = {
  items: [
    { id: "n1", title: "New listing pending review", description: "3BHK Sea View Apartment, Mumbai", time: "5m ago", read: false },
    { id: "n2", title: "Payment failed", description: "Txn #TXN-88213 for Featured plan", time: "42m ago", read: false },
    { id: "n3", title: "New builder verification request", description: "Skyline Developers submitted RERA docs", time: "2h ago", read: false },
    { id: "n4", title: "Review flagged", description: "A review on Lakeview Residency was flagged as spam", time: "5h ago", read: true },
  ],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
  },
});

export const { markAllRead, markRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
