CREATE TABLE `shoppingList` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shoppingListUsers` (
	`user_id` integer NOT NULL,
	`shoppingList_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `shoppingList_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shoppingList_id`) REFERENCES `shoppingList`(`id`) ON UPDATE no action ON DELETE no action
);
