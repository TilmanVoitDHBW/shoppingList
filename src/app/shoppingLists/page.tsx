"use client"

import { NavUser } from "@/components/nav-user"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateListDialog } from "@/components/create-list-dialog"
import { ShoppingListAccordion } from "@/components/shopping-list-accordion"
import { createList } from "@/actions/createList"
import { createItem } from "@/actions/createItem"
import { addUserToList } from "@/actions/addUserToList"
import {removeItem} from "@/actions/removeItem"
import { getLists} from "@/actions/getLists"
import { getUser } from "@/actions/getUser"
import { removeList } from "@/actions/removeList"

export type ShoppingItem = {
  id: number
  productName: string
  amount: number
  measurementUnit: string
}

export type ShoppingList = {
  id: number
  title: string
} 

export type NewShoppingItem = {
  productName: string
  amount: number
  measurementUnit: string
}

export type User = {
  name: string,
  email: string
  avatar: string | null
}

export default function Home() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
 	const [lists, setLists] = useState<ShoppingList[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShoppingLists() {
      try {
        setLoading(true);
        const listsData = await getLists(); // Using your function
        if (!listsData || !Array.isArray(listsData)) {
          setLists([]);
        } else {
            setLists(listsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingLists();
  }, []);

  useEffect(() => {
    async function fetchUser(){
      try {
        setLoading(true);
        const currentUser = await getUser();
        setUser(currentUser)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      finally {
        setLoading(false);
      }
    }
  }

  )

  if (loading) {
    return <div>Loading your shopping lists...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const handleAddItem = (listId: number, item: NewShoppingItem) => {
      createItem(listId, item.productName, item.amount, item.measurementUnit)
  }

  const handleRemoveItem = (listId: number, itemId: number) => {
    removeItem(itemId)
  }

  const handleAddUser = (listId: number, userEmail: string) => {
    addUserToList(listId, userEmail)
  }

  

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Shopping Lists</h1>
            <p className="mt-2 text-muted-foreground">Create and manage your shopping lists</p>
          </div>
          {user && (
            <NavUser
              user={{
                name: user.name,
                email: user.email,
                avatar: user.avatar ?? "",
              }}
            />
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New List
          </Button>
        </div>
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No shopping lists yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first shopping list</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-6">
              Create List
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
              {lists.map((list) => (
                <ShoppingListAccordion
                  key={list.id}
                  list={list}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onAddUser={handleAddUser}
                />
                ))}
        </div>

        )}
        <CreateListDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateList={createList}
        />
      </div> 
    </main>
  )
}
