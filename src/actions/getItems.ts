"use server"

import { db } from "@/db";
import {item, shoppingListItems} from "@/db/schema"
import { desc, eq } from "drizzle-orm";

export async function getItems(listId: number){
    const items = await db
  .select({
    id: item.id,
    productName: item.productName,
    amount: item.amount,
    measurementUnit: item.measurementUnit, 
  })
  .from(shoppingListItems)
  .innerJoin(item, eq(shoppingListItems.itemId, item.id))
  .where(eq(shoppingListItems.shoppingListId, listId))
  .orderBy(desc(item.priority));
  console.error("List id: ", listId)
  return items

}