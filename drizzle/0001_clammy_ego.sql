CREATE TABLE `contact_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(200) NOT NULL,
	`phone` varchar(60) NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_inquiries_id` PRIMARY KEY(`id`)
);
