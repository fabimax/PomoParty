import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setTodoComplete,
  editTodoText,
  deleteTodo,
  startEditingTodo,
  updateEditText,
  cancelEditing
} from '../store/modules/todo';

export default function TodoItem({ todoId }) {
  const dispatch = useDispatch();
  const todo = useSelector(state => state.todo.todos.find(t => t.id === todoId));
  const loading = useSelector(state => state.todo.loading);
  const editingTodoId = useSelector(state => state.todo.editingTodoId);
  const editText = useSelector(state => state.todo.editText);
  
  if (!todo) return null;
  
  const isEditing = editingTodoId === todo.id;

  let content;
  
  if (isEditing) {
    content = (
      <div className="flex-1 flex items-center">
        <input
          type="text"
          value={editText}
          onChange={(e) => dispatch(updateEditText(e.target.value))}
          className="flex-1 px-2 py-1 border rounded text-black"
          autoFocus
        />
        <div className="flex ml-2 space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              dispatch(editTodoText(todo.id, editText));
            }}
            disabled={!editText.trim() || loading}
            className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Save
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              dispatch(cancelEditing());
            }}
            className="px-2 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => {
              e.stopPropagation();
              dispatch(setTodoComplete(todo.id, !todo.completed));
            }}
            className="mr-3 h-5 w-5 text-blue-500"
          />
          <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
            {todo.text}
          </span>
        </div>
        
        <div className="flex space-x-2 ml-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              dispatch(startEditingTodo(todo.id));
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              dispatch(deleteTodo(todo.id));
            }}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </>
    );
  }

  return (
    <li 
      className="border rounded-lg p-3 flex flex-col cursor-pointer"
      onClick={() => !isEditing && dispatch(setTodoComplete(todo.id, !todo.completed))}
    >
      <div className="flex items-start justify-between">
        {content}
      </div>
    </li>
  );
} 