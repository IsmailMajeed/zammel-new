import { createSlice } from "@reduxjs/toolkit";
import { accessKey } from "../../utils/constants";

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
  user: safeJsonParse("user", null),
  token: (typeof window !== 'undefined' && localStorage.getItem(accessKey)) || null,
  wishlist: safeJsonParse("wishlist", []),
  orders: safeJsonParse("orders", []),
  addresses: safeJsonParse("addresses", []),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.user;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
        } catch (error) {
          // ignore storage errors
        }
        if (payload.token) {
          state.token = payload.token;
          localStorage.setItem(accessKey, payload.token);
        }
      }
    },
    markFirstLoginSeen: (state) => {
      if (state.user) {
        state.user = { ...state.user, isFirstLogin: false };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem("user", JSON.stringify(state.user));
          } catch (error) {
            // ignore storage errors
          }
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.wishlist = [];
      state.orders = [];
      state.addresses = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(accessKey);
        localStorage.removeItem("user");
        localStorage.removeItem("wishlist");
        localStorage.removeItem("orders");
        localStorage.removeItem("addresses");
      }
    },
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.wishlist.find(item => item.id === product.id);
      if (!existingItem) {
        state.wishlist.push(product);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
          } catch (error) {
            // ignore storage errors
          }
        }
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
        } catch (error) {
          // ignore storage errors
        }
      }
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("orders", JSON.stringify(state.orders));
        } catch (error) {
          // ignore storage errors
        }
      }
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("addresses", JSON.stringify(state.addresses));
        } catch (error) {
          // ignore storage errors
        }
      }
    },
    updateAddress: (state, action) => {
      const { id, ...updatedAddress } = action.payload;
      const index = state.addresses.findIndex(addr => addr.id === id);
      if (index !== -1) {
        state.addresses[index] = { ...state.addresses[index], ...updatedAddress };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem("addresses", JSON.stringify(state.addresses));
          } catch (error) {
            // ignore storage errors
          }
        }
      }
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem("addresses", JSON.stringify(state.addresses));
        } catch (error) {
          // ignore storage errors
        }
      }
    },
  },
});

export const {
  setUser,
  logout,
  markFirstLoginSeen,
  addToWishlist,
  removeFromWishlist,
  addOrder,
  addAddress,
  updateAddress,
  removeAddress
} = userSlice.actions;
export default userSlice.reducer;
