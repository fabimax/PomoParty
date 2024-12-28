import { sqliteTable, AnySQLiteColumn, uniqueIndex, text, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	uuid: text().primaryKey().notNull(),
	username: text().notNull(),
	createdAt: integer().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: integer().default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => {
	return {
		usernameUnique: uniqueIndex("users_username_unique").on(table.username),
	}
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {
});

