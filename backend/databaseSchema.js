import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  uuid: text('uuid').primaryKey().notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: integer('createdAt').notNull().default(sql`UNIXEPOCH() * 1000`),
  updatedAt: integer('updatedAt').notNull().default(sql`UNIXEPOCH() * 1000`),
});

export const chatMessages = sqliteTable('chatMessages', {
  uuid: text('uuid').primaryKey().notNull(),
  userId: text('userId').references(() => users.uuid),
  messageText: text('messageText').notNull(),
  createdAt: integer('createdAt').notNull().default(sql`UNIXEPOCH() * 1000`),
  updatedAt: integer('updatedAt').notNull().default(sql`UNIXEPOCH() * 1000`),
});
