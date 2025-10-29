import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "@reduxjs/toolkit";

import { authApi } from "./api/Auth";
import userReducer from "./slices/User";
import cartReducer from "./slices/Cart";
import wishlistReducer from "./slices/Wishlist";
import productsReducer from "./slices/Products";
import ordersReducer from "./slices/Orders";
import customersReducer from "./slices/Customers";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart", "wishlist"], // Only persist these slices
  blacklist: ["authApi"], // Don't persist API cache
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productsReducer,
  orders: ordersReducer,
  customers: customersReducer,
  [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
    ),
});

export const persistor = persistStore(store);
export default store;
