CREATE TABLE `listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`purpose` text NOT NULL,
	`property_type` text NOT NULL,
	`location` text NOT NULL,
	`price` text NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`area` integer NOT NULL,
	`furnished` text NOT NULL,
	`image_url` text NOT NULL,
	`description` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
