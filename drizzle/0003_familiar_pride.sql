CREATE TABLE `formAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formId` int NOT NULL,
	`event` varchar(50) NOT NULL,
	`sessionId` varchar(100),
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrer` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `formAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `forms` ADD `webhookUrl` varchar(500);