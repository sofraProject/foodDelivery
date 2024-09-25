"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../libs/redux/hooks";
import { addTodo, removeTodo } from "../../libs/redux/slices/todos";

const TodoComponent = () => {
  const todos = useAppSelector((state) => state.todos.todos); // Sélectionner les todos depuis le store
  const dispatch = useAppDispatch();
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo("");
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => dispatch(removeTodo(index))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;
