import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (!existingItem) {
        state.items.push({
          ...product,
          addedAt: new Date().toISOString()
        });
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    toggleWishlist: (state) => {
      state.isOpen = !state.isOpen;
    },

    openWishlist: (state) => {
      state.isOpen = true;
    },

    closeWishlist: (state) => {
      state.isOpen = false;
    },

    loadWishlistFromStorage: (state, action) => {
      const savedWishlist = action.payload;
      if (savedWishlist) {
        state.items = savedWishlist.items || [];
      }
    }
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
  openWishlist,
  closeWishlist,
  loadWishlistFromStorage
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
