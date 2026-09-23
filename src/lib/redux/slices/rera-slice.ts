import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockReraRecords, type ReraRecord, type ComplianceStatus } from "@/lib/mock/rera";

interface ReraState {
  items: ReraRecord[];
}

const initialState: ReraState = {
  items: mockReraRecords,
};

const reraSlice = createSlice({
  name: "rera",
  initialState,
  reducers: {
    addReraRecord(state, action: PayloadAction<ReraRecord>) {
      state.items.unshift(action.payload);
    },
    updateReraRecord(state, action: PayloadAction<{ id: string; changes: Partial<ReraRecord> }>) {
      const record = state.items.find((r) => r.id === action.payload.id);
      if (record) Object.assign(record, action.payload.changes);
    },
    deleteReraRecord(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
    setReraCompliance(state, action: PayloadAction<{ id: string; complianceStatus: ComplianceStatus }>) {
      const record = state.items.find((r) => r.id === action.payload.id);
      if (record) record.complianceStatus = action.payload.complianceStatus;
    },
  },
});

export const { addReraRecord, updateReraRecord, deleteReraRecord, setReraCompliance } = reraSlice.actions;
export default reraSlice.reducer;
