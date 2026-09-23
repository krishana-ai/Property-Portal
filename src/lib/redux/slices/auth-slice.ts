import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AdminRole = "Super Admin" | "Moderator" | "Support" | "Finance";

export interface AdminUser {
  name: string;
  email: string;
  role: AdminRole;
}

interface AuthState {
  isAuthenticated: boolean;
  currentAdmin: AdminUser;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentAdmin: {
    name: "Priya Sharma",
    email: "priya.sharma@anavrinproperty.com",
    role: "Super Admin",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentAdmin(state, action: PayloadAction<AdminUser>) {
      state.currentAdmin = action.payload;
    },
    login(state, action: PayloadAction<{ identifier: string } | undefined>) {
      state.isAuthenticated = true;
      if (action.payload?.identifier) {
        const identifier = action.payload.identifier;
        state.currentAdmin = {
          ...state.currentAdmin,
          email: identifier.includes("@") ? identifier : state.currentAdmin.email,
        };
      }
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { setCurrentAdmin, login, logout } = authSlice.actions;
export default authSlice.reducer;
