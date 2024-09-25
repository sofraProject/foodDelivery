import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./reducers/todos.reducers";

export const makeStore = () => {
  return configureStore({
    reducer: {
      todos: todosReducer, // Ajout du reducer des todos
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
