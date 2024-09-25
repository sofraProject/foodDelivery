import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
  todos: string[];
}

const initialState: TodoState = {
  todos: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push(action.payload); // Ajout d'une tâche
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos.splice(action.payload, 1); // Suppression d'une tâche par son index
    },
  },
});

export const { addTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
