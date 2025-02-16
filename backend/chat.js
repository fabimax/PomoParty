import * as databaseSchema from './databaseSchema.js';
import db from './database.js';
import { eq } from 'drizzle-orm';

export async function createMessage(text) {
  const uuid = crypto.randomUUID();
  await db.insert(databaseSchema.chatMessages).values({
    uuid,
    messageText: text.trim(),
  });
}

export async function getAllMessages() {
  return await db.select()
    .from(databaseSchema.chatMessages)
    .orderBy(databaseSchema.chatMessages.createdAt)
    .all();
} 