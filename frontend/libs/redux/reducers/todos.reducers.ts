import { createReducer } from "@reduxjs/toolkit";
import { addTodo, removeTodo } from "../actions/todo.action";

interface TodoState {
  todos: string[];
}

const initialState: TodoState = {
  todos: [],
};

const todosReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      state.todos.push(action.payload); // Ajout d'une tâche
    })
    .addCase(removeTodo, (state, action) => {
      state.todos.splice(action.payload, 1); // Suppression d'une tâche par son index
    });
});

export default todosReducer;
