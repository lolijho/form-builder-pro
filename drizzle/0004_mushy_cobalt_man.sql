CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','editor','viewer') NOT NULL,
	`invitedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `forms` MODIFY COLUMN `webhookUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `forms` ADD `autoResponderEnabled` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `autoResponderSubject` varchar(255);--> statement-breakpoint
ALTER TABLE `forms` ADD `autoResponderMessage` text;