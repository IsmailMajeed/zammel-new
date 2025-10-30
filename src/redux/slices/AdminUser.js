import { createSlice } from "@reduxjs/toolkit";
import { adminAccessKey } from "../../utils/constants";

const safeJsonParse = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const initialState = {
  user: safeJsonParse("admin_user", null),
  token: (typeof window !== 'undefined' && localStorage.getItem(adminAccessKey)) || null,
};

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    setAdminUser: (state, { payload }) => {
      state.user = payload.user;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("admin_user", JSON.stringify(state.user));
        } catch (error) { }
        if (payload.token) {
          state.token = payload.token;
          localStorage.setItem(adminAccessKey, payload.token);
        }
      }
    },
    logoutAdmin: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(adminAccessKey);
        localStorage.removeItem("admin_user");
      }
    },
  },
});

export const { setAdminUser, logoutAdmin } = adminUserSlice.actions;
export default adminUserSlice.reducer;


