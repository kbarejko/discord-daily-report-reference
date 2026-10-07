CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_user_id` text NOT NULL,
	`day` text NOT NULL,
	`done` text NOT NULL,
	`hours` real NOT NULL,
	`problems` text,
	`plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reports_user_day` ON `reports` (`discord_user_id`,`day`);--> statement-breakpoint
CREATE INDEX `reports_day` ON `reports` (`day`);