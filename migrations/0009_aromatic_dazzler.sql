ALTER TABLE users RENAME COLUMN createdAt TO createdAt_old;
--> statement-breakpoint
ALTER TABLE users RENAME COLUMN updatedAt TO updatedAt_old;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN createdAt integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN updatedAt integer NOT NULL DEFAULT 0;
--> statement-breakpoint
UPDATE users SET 
    createdAt = strftime('%s', createdAt_old) * 1000,
    updatedAt = strftime('%s', updatedAt_old) * 1000;
--> statement-breakpoint
ALTER TABLE users DROP COLUMN createdAt_old;
--> statement-breakpoint
ALTER TABLE users DROP COLUMN updatedAt_old;
--> statement-breakpoint
ALTER TABLE chatMessages RENAME COLUMN createdAt TO createdAt_old;
--> statement-breakpoint
ALTER TABLE chatMessages RENAME COLUMN updatedAt TO updatedAt_old;
--> statement-breakpoint
ALTER TABLE chatMessages ADD COLUMN createdAt integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE chatMessages ADD COLUMN updatedAt integer NOT NULL DEFAULT 0;
--> statement-breakpoint
UPDATE chatMessages SET 
    createdAt = strftime('%s', createdAt_old) * 1000,
    updatedAt = strftime('%s', updatedAt_old) * 1000;
--> statement-breakpoint
ALTER TABLE chatMessages DROP COLUMN createdAt_old;
--> statement-breakpoint
ALTER TABLE chatMessages DROP COLUMN updatedAt_old;