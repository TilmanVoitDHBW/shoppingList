PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_shoppingListUsers` (
	`user_id` text NOT NULL,
	`shoppingList_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `shoppingList_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shoppingList_id`) REFERENCES `shoppingList`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_shoppingListUsers`("user_id", "shoppingList_id") SELECT "user_id", "shoppingList_id" FROM `shoppingListUsers`;--> statement-breakpoint
DROP TABLE `shoppingListUsers`;--> statement-breakpoint
ALTER TABLE `__new_shoppingListUsers` RENAME TO `shoppingListUsers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;