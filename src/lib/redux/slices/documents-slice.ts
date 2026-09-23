import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockDocuments, type DocumentRecord, type DocumentStatus } from "@/lib/mock/documents";

interface DocumentsState {
  items: DocumentRecord[];
}

const initialState: DocumentsState = {
  items: mockDocuments,
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    addDocument(state, action: PayloadAction<DocumentRecord>) {
      state.items.unshift(action.payload);
    },
    updateDocument(state, action: PayloadAction<{ id: string; changes: Partial<DocumentRecord> }>) {
      const doc = state.items.find((d) => d.id === action.payload.id);
      if (doc) Object.assign(doc, action.payload.changes);
    },
    deleteDocument(state, action: PayloadAction<string>) {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    setDocumentStatus(state, action: PayloadAction<{ id: string; status: DocumentStatus }>) {
      const doc = state.items.find((d) => d.id === action.payload.id);
      if (doc) doc.status = action.payload.status;
    },
  },
});

export const { addDocument, updateDocument, deleteDocument, setDocumentStatus } = documentsSlice.actions;
export default documentsSlice.reducer;
