import React from 'react';
import TodoList from './TodoList';

export default function TodoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <TodoList />
      </div>
    </div>
  );
} 