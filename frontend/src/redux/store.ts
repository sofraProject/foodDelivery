import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default to localStorage for web
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import usersReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import searchReducer from "./features/searchSlice";
import orderReducer from './features/orderSlice'; 

// Fallback to noopStorage when localStorage is not available
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storageAvailable = typeof window !== "undefined" ? storage : createNoopStorage();

// Combine all reducers into a single rootReducer
const rootReducer = combineReducers({
  users: usersReducer,
  cart: cartReducer,
  search: searchReducer,
});

// redux-persist configuration
const persistConfig = {
  key: "root",
  storage: storageAvailable, // Use the available storage (localStorage or noopStorage)
};

// Apply redux-persist to the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persistent reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings on serialization for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

