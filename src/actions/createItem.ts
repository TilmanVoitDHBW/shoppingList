"use server"

import { db } from "@/db"
import {item, shoppingListItems} from "@/db/schema"
import { ShoppingItem } from "@/app/shoppingLists/page"

export async function createItem(listId: number, productName: string, amount: number, measurementUnit: string){
    const [newItem] = await db
                            .insert(item)
                            .values({productName: productName, amount: amount, measurementUnit: measurementUnit})
                            .returning()
    await db.insert(shoppingListItems).values({itemId: Number(newItem.id), shoppingListId: listId})
}