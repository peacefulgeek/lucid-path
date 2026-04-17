CREATE TABLE `failed_asins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asin` varchar(10) NOT NULL,
	`reason` varchar(128) NOT NULL,
	`title` text,
	`category` varchar(64),
	`lastChecked` timestamp NOT NULL DEFAULT (now()),
	`failedAt` timestamp NOT NULL DEFAULT (now()),
	`articleSlugs` text,
	`replacedBy` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `failed_asins_id` PRIMARY KEY(`id`),
	CONSTRAINT `failed_asins_asin_unique` UNIQUE(`asin`)
);
--> statement-breakpoint
CREATE TABLE `generation_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(256),
	`topic` text,
	`category` varchar(64),
	`attempt` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`failures` text,
	`wordCount` int,
	`amazonLinks` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generation_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verified_asins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asin` varchar(10) NOT NULL,
	`title` text,
	`category` varchar(64),
	`lastChecked` timestamp NOT NULL DEFAULT (now()),
	`lastValid` timestamp NOT NULL DEFAULT (now()),
	`httpStatus` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verified_asins_id` PRIMARY KEY(`id`),
	CONSTRAINT `verified_asins_asin_unique` UNIQUE(`asin`)
);
