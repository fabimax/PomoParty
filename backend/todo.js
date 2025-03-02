import * as databaseSchema from './databaseSchema.js';
import * as yup from 'yup';
import db from './database.js';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';

export function validateTodoText(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Task cannot be empty');
  }
  
  if (text.length > 1000) {
    throw new Error('Task is too long. Maximum length is 1000 characters');
  }
  
  return text.trim();
}

export async function createTodo({ userId, text }) {
  const trimmedText = validateTodoText(text);
  
  const uuid = crypto.randomUUID();
  return await db.insert(databaseSchema.todos).values({
    uuid,
    text: trimmedText,
    userId,
    completed: false,
    createdAt: moment().valueOf(),
  }).returning().then(result => result[0]);
}

export async function getTodosByUserId(userId) {
  const todos = await db.select()
    .from(databaseSchema.todos)
    .where(eq(databaseSchema.todos.userId, userId))
    .orderBy(desc(databaseSchema.todos.createdAt))
    .all();

  return todos.map(todo => ({
    id: todo.uuid,
    text: todo.text,
    completed: todo.completed,
    createdAt: todo.createdAt,
  }));
}

export async function updateTodoCompletion({ todoId, userId, completed }) {
  const todo = await db.select()
    .from(databaseSchema.todos)
    .where(eq(databaseSchema.todos.uuid, todoId))
    .get();
    
  if (!todo || todo.userId !== userId) {
    throw new Error('Todo not found or not authorized');
  }
  
  await db.update(databaseSchema.todos)
    .set({ 
      completed,
      updatedAt: moment().valueOf()
    })
    .where(eq(databaseSchema.todos.uuid, todoId))
    .run();
}

export async function updateTodoText({ todoId, userId, newText }) {
  const trimmedText = validateTodoText(newText);
  
  const todo = await db.select()
    .from(databaseSchema.todos)
    .where(eq(databaseSchema.todos.uuid, todoId))
    .get();
    
  if (!todo || todo.userId !== userId) {
    throw new Error('Todo not found or not authorized');
  }
  
  await db.update(databaseSchema.todos)
    .set({ 
      text: trimmedText,
      updatedAt: moment().valueOf()
    })
    .where(eq(databaseSchema.todos.uuid, todoId))
    .run();
}

export async function deleteTodo({ todoId, userId }) {
  const todo = await db.select()
    .from(databaseSchema.todos)
    .where(eq(databaseSchema.todos.uuid, todoId))
    .get();
    
  if (!todo || todo.userId !== userId) {
    throw new Error('Todo not found or not authorized');
  }
  
  await db.delete(databaseSchema.todos)
    .where(eq(databaseSchema.todos.uuid, todoId))
    .run();
} 