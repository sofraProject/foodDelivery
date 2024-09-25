import { createAction } from "@reduxjs/toolkit";

export const addTodo = createAction<string>("todos/addTodo");
export const removeTodo = createAction<number>("todos/removeTodo");
