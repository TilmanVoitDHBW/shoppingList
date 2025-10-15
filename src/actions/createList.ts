"use server"

import { redirect } from "next/navigation";
import "server-only";
import {z} from "zod";
import {shoppingList, shoppingListUsers, user} from "@/db/schema";
import {db} from "@/db";
import { getUserId } from "./getUserId";

const titleSchema = z.object({
    title: z.string().min(1)
}
)



async function createListWithUser(title: string, userId: String) {
  // Insert the new shopping list
  const [newList] = await db
    .insert(shoppingList)
    .values({ title })
    .returning({ id: shoppingList.id });
	console.log("UserId: " + userId)
	console.log("ListId: " + newList.id)
  //Insert into the join table to link the user
  await db.insert(shoppingListUsers).values({
    shoppingListId: newList.id,
    userId,
  });
}

export type titleSchema = z.infer<typeof titleSchema>;

export async function createList(title: string){
  const userId = await getUserId()
  createListWithUser(title, userId)
	const lists = await db.select().from(shoppingList)
	console.log("Logging lists:")
	console.log(lists)
	const users = await db.select().from(user)
	console.log("Logging users:")
	console.log(users)
  redirect("/shoppingLists")  
}