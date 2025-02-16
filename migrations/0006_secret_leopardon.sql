CREATE TABLE `messages` (
	`uuid` text PRIMARY KEY NOT NULL,
	`messageText` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
