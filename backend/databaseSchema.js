import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  uuid: text('uuid').primaryKey().notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});
