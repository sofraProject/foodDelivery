import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import searchReducer from "./features/searchSlice";
import orderReducer from './features/orderSlice'; 

export const store = configureStore({
  reducer: {
    users: usersReducer,
    cart: cartReducer,
    search: searchReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
