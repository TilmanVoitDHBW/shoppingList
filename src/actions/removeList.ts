"use server"

import { shoppingList, shoppingListUsers, shoppingListItems } from "@/db/schema"
import { db } from "@/db"
import { eq, sql } from "drizzle-orm"


export async function removeList(listId: number){
    console.error(listId)
    await db.delete(shoppingListUsers).where(eq(shoppingListUsers.shoppingListId, listId))
    await db.delete(shoppingListItems).where(eq(shoppingListItems.shoppingListId, listId))
    await db.delete(shoppingList).where(eq(shoppingList.id, listId))
}