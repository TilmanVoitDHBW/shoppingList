"use server"

import { db } from "@/db"
import {item, shoppingListItems} from "@/db/schema"
import { eq } from "drizzle-orm"

export async function removeItem(removeId: number){
    await db.delete(shoppingListItems).where(eq(shoppingListItems.itemId, removeId))
    await db.delete(item).where(eq(item.id, removeId))
}