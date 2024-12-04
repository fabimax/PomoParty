import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const rooms = sqliteTable('rooms', {
  port: integer('port').primaryKey(),
  title: text('title').notNull()
});