import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTodos,
  createTodo,
  updateDraftTodo
} from '../store/modules/todo';
import TodoItem from './TodoItem';

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todo.todos);
  const loading = useSelector(state => state.todo.loading);
  const draftTodo = useSelector(state => state.todo.draftTodo);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt - a.createdAt;
  });

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow p-4 flex flex-col ${loading ? 'opacity-80' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="w-5"></div> {/* Empty div for balance */}
        <h3 className="font-semibold text-gray-700 text-xl">My Tasks</h3>
        <div className="w-5">
          {loading && <LoadingSpinner />}
        </div>
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        dispatch(createTodo());
      }} className="mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={draftTodo}
            onChange={(e) => dispatch(updateDraftTodo(e.target.value))}
            disabled={loading}
            placeholder="Add a new task..."
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black border-gray-300 ${
              loading ? 'bg-gray-100' : 'bg-white'
            }`}
          />
          <button 
            type="submit" 
            disabled={loading || !draftTodo.trim()}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>
      
      <div className="flex-1 overflow-y-auto">
        {loading && todos.length === 0 ? (
          <div className="flex justify-center items-center py-4">
            <LoadingSpinner />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tasks yet. Add one above!</div>
        ) : (
          <ul className="space-y-2">
            {sortedTodos.map(todo => (
              <TodoItem key={todo.id} todoId={todo.id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 