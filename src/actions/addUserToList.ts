"use server"

import { db } from "@/db"
import { shoppingListUsers, user } from "@/db/schema"
import { abort } from "process"

export async function addUserToList(listId: number, userEmail: string){
    const user = await db.select({userId: user.id}).from(user).where(eq(user.email, userEmail))
    await db.insert(shoppingListUsers).values({shoppingListId: listId, userId: user.id})
}