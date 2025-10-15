"use server"

import {shoppingListUsers, shoppingList } from "@/db/schema";
import { getUserId } from "./getUserId";
import { db } from "@/db";
import {eq, inArray} from "drizzle-orm"

export async function getLists(){
    const userId = await getUserId();
  
    const lists = await db
        .select({
        id: shoppingList.id,
        title: shoppingList.title,
    })
    .from(shoppingListUsers)
    .innerJoin(
      shoppingList, 
      eq(shoppingListUsers.shoppingListId, shoppingList.id)
    )
    .where(eq(shoppingListUsers.userId, userId));
  
  return lists;
}

