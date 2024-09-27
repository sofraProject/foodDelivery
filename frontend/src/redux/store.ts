import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default to localStorage for web
import usersReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import searchReducer from "./features/searchSlice";

// Combine tous les reducers dans un seul rootReducer
const rootReducer = combineReducers({
  users: usersReducer,
  cart: cartReducer,
  search: searchReducer,
});

// Configuration redux-persist
const persistConfig = {
  key: "root",
  storage, // Utilise localStorage pour persister
};

// Application de redux-persist à ton rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store avec le reducer persistant
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactive les avertissements sur la sérialisation pour redux-persist
    }),
});

// Création du persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
