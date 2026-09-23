import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockUsers, type AppUser, type UserStatus, type VerificationStatus } from "@/lib/mock/users";

interface UsersState {
  items: AppUser[];
}

const initialState: UsersState = {
  items: mockUsers,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<AppUser>) {
      state.items.unshift(action.payload);
    },
    updateUser(state, action: PayloadAction<{ id: string; changes: Partial<AppUser> }>) {
      const user = state.items.find((u) => u.id === action.payload.id);
      if (user) Object.assign(user, action.payload.changes);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
    setUserStatus(state, action: PayloadAction<{ id: string; status: UserStatus }>) {
      const user = state.items.find((u) => u.id === action.payload.id);
      if (user) user.status = action.payload.status;
    },
    setUserVerification(state, action: PayloadAction<{ id: string; verification: VerificationStatus }>) {
      const user = state.items.find((u) => u.id === action.payload.id);
      if (user) user.verification = action.payload.verification;
    },
  },
});

export const { addUser, updateUser, deleteUser, setUserStatus, setUserVerification } = usersSlice.actions;
export default usersSlice.reducer;
