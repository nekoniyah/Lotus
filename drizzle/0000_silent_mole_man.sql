CREATE TABLE `currencies` (
	`guildId` text NOT NULL,
	`name` text DEFAULT 'LotusBucks',
	`emoji` text DEFAULT '🪷',
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `currencies_guildId_unique` ON `currencies` (`guildId`);--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` text NOT NULL,
	`logChannelId` text,
	`levelingChannelId` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_id_unique` ON `guilds` (`id`);--> statement-breakpoint
CREATE TABLE `inventories` (
	`guildId` text NOT NULL,
	`itemId` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventories_guildId_unique` ON `inventories` (`guildId`);--> statement-breakpoint
CREATE UNIQUE INDEX `inventories_itemId_unique` ON `inventories` (`itemId`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`cost` integer NOT NULL,
	`activation` text DEFAULT 'consumable' NOT NULL,
	`filepath` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_guildId_unique` ON `items` (`guildId`);--> statement-breakpoint
CREATE TABLE `levelRoles` (
	`guildId` text NOT NULL,
	`roleId` text NOT NULL,
	`level` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`userId` text NOT NULL,
	`guildId` text NOT NULL,
	`level` integer DEFAULT 0,
	`experience` integer DEFAULT 0,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `memberRoles` (
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`roleId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modmailSessions` (
	`modmailId` text NOT NULL,
	`memberId` text NOT NULL,
	`open` integer DEFAULT false,
	FOREIGN KEY (`modmailId`) REFERENCES `modmails`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modmails` (
	`id` integer PRIMARY KEY NOT NULL,
	`categoryId` text,
	`guildId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modmails_guildId_unique` ON `modmails` (`guildId`);--> statement-breakpoint
CREATE TABLE `multipliersRoles` (
	`guildId` text NOT NULL,
	`multiplier` integer DEFAULT 1.1,
	`roleId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reactionRoles` (
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`messageId` text NOT NULL,
	`roleId` text NOT NULL,
	`emoji` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `starboards` (
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`goal` integer DEFAULT 5,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `starboards_guildId_unique` ON `starboards` (`guildId`);--> statement-breakpoint
CREATE TABLE `stickyMessages` (
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	`content` text NOT NULL,
	`messageId` text,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stickyRoles` (
	`guildId` text NOT NULL,
	`roleId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stickyRoles_roleId_unique` ON `stickyRoles` (`roleId`);--> statement-breakpoint
CREATE TABLE `wallets` (
	`guildId` text NOT NULL,
	`userId` text NOT NULL,
	`amount` integer DEFAULT 0,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `welcomers` (
	`guildId` text NOT NULL,
	`channelId` text NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `welcomers_guildId_unique` ON `welcomers` (`guildId`);