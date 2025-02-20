import * as databaseSchema from './databaseSchema.js';
import * as yup from 'yup';
import db from './database.js';
import { eq, desc } from 'drizzle-orm';

const chatMessageSchema = yup.object({
  text: yup.string()
    .required('Message cannot be empty')
    .trim()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message is too long. Maximum length is 500 characters')
});

export async function validateMessage({ text }) {
  try {
    await chatMessageSchema.validate({ text }, { abortEarly: false });
    return {
      success: true
    };
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      throw error;
    }

    const errors = error.inner.reduce((acc, err) => {
      if (!acc[err.path]) {
        acc[err.path] = [];
      }
      acc[err.path].push(err.message);
      return acc;
    }, {});
      
    return {
      success: false,
      errors
    };
  }
}

export async function createMessage({text, userId}) {
  const uuid = crypto.randomUUID();
  return await db.insert(databaseSchema.chatMessages).values({
    uuid,
    messageText: text.trim(),
    userId: userId,
  }).returning().then(result => result[0]);
}

export async function getAllMessages() {
  let messages = await db.select()
    .from(databaseSchema.chatMessages)
    .leftJoin(databaseSchema.users, eq(databaseSchema.chatMessages.userId, databaseSchema.users.uuid))
    .orderBy(desc(databaseSchema.chatMessages.createdAt))
    .limit(50)
    .all();

  return messages.map(({chatMessages, users}) => ({
    uuid: chatMessages.uuid,
    userId: chatMessages.userId,
    username: users?.username || 'anonymous',
    text: chatMessages.messageText,
    timestamp: chatMessages.createdAt,
  }));
} 