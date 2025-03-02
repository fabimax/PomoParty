CREATE TABLE `todos` (
	`uuid` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`text` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`uuid`) ON UPDATE no action ON DELETE no action
);
