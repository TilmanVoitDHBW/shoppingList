"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Trash2, Key, Download } from "lucide-react"
import { AddItemDialog } from "@/components/add-item-dialog"
import { AddUserDialog } from "@/components/add-user-dialog"
import { getItems } from "@/actions/getItems"
import { ShoppingItem, NewShoppingItem } from "@/app/shoppingLists/page"
import { removeList } from "@/actions/removeList"

type ShoppingList = {
  id: number
  title: string
}

type ShoppingListAccordionProps = {
  list: ShoppingList
  onAddItem: (listId: number, item: NewShoppingItem) => void
  onRemoveItem: (listId: number, itemId: number) => void 
  onAddUser: (listId: number, userEmail: string) => void
}

export function ShoppingListAccordion({list, onAddItem, onRemoveItem, onAddUser }: ShoppingListAccordionProps) {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
  async function fetchItems() {
    setLoading(true);
    try {
      const data = await getItems(list.id);
      console.error("Data: " + data)
      const mappedItems: ShoppingItem[] = data.map((item) => ({
        id: Number(item.id),
        productName: String(item.productName),
        amount: Number(item.amount),
        measurementUnit: String(item.measurementUnit),
      }));
      console.error("Logging items:")
      console.error(mappedItems)
      setItems(mappedItems);
    } finally {
      setLoading(false);
    }
  }
  fetchItems();
}, [refreshKey]);

  const onRemoveList = () => {
    removeList(list.id)
  }

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={list.title.toString()} className="rounded-lg border border-border bg-card px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-1 items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{list.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex gap-2">
                <Button onClick={() => setIsAddItemOpen(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
                <Button onClick={() => setIsAddUserOpen(true)} size="sm" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Add User
                </Button>
                <Button onClick={() => onRemoveList()} size="sm" variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete List
                </Button>
                <Button onClick={() => downloadList(items)} size="sm" variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download List
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No items yet. Add your first item to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.amount} {item.measurementUnit}
                        </p>
                      </div>
                      <Button
                        onClick={() => onRemoveItem(list.id, item.id)}
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AddItemDialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
        onAddItem={(item) => onAddItem(list.id, item)}
      />

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAddUser={(email) => onAddUser(list.id, email)}
      />
    </>
  )
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.")
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function downloadList(items: ShoppingItem[]){
  var text = ""
  items.forEach(item => {
    text += `- ${item.productName}:    ${item.amount} ${item.measurementUnit}\n`    
  });
  downloadTextFile("yourShoppinglist.txt", text)
}
