CREATE TABLE `users` (
	`uuid` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
