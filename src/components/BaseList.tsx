import { useState } from "react";
import { Archive } from "lucide-react";
import { BaseItem, PendingItem, Tag } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListItem } from "./list/ListItem";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  onSaveItem: (item: BaseItem) => void;
  availableTags?: Tag[];
  showDate?: boolean;
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  onSaveItem,
  availableTags = [],
  showDate = false
}: BaseListProps) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [archivedItems, setArchivedItems] = useState<BaseItem[]>([]);
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  const handlePendingItem = (item: PendingItem) => {
    setPendingItem(item);
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    const newItem: BaseItem = {
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false,
      tags: pendingItem.tags,
      date: showDate ? pendingItem.date : undefined,
      notes: pendingItem.notes || ""
    };
    
    setItems([...items, newItem]);
    onSaveItem(newItem);
    setPendingItem(null);
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    
    const toggledItem = updatedItems.find(item => item.id === id);
    if (toggledItem) {
      onSaveItem(toggledItem);
      toast({
        title: toggledItem.completed ? "Item Completed" : "Item Uncompleted",
        description: toggledItem.title
      });
    }
  };

  const updateItemNotes = (id: string, notes: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, notes } : item
    );
    setItems(updatedItems);
    
    const updatedItem = updatedItems.find(item => item.id === id);
    if (updatedItem) {
      onSaveItem(updatedItem);
    }
  };

  const archiveCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) {
      toast({
        title: "No items to archive",
        description: "Complete some items first!",
        variant: "destructive"
      });
      return;
    }
    
    setArchivedItems([...archivedItems, ...completedItems]);
    setItems(items.filter(item => !item.completed));
    toast({
      title: "Items Archived",
      description: `${completedItems.length} items have been archived`
    });
  };

  // Sort items: dated items first (sorted by date), then undated items
  const sortedItems = [...(showArchived ? archivedItems : items)].sort((a, b) => {
    if (!showDate) return 0;
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          {!showArchived && (
            <Button
              variant="outline"
              onClick={archiveCompleted}
              className="flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive Completed
            </Button>
          )}
        </div>
      </div>

      {!showArchived && (
        <>
          <AddItemForm 
            urlPlaceholder={urlPlaceholder}
            onPendingItem={handlePendingItem}
          />

          {pendingItem && (
            <ItemEditor
              pendingItem={pendingItem}
              onPendingItemChange={setPendingItem}
              onSave={savePendingItem}
              availableTags={availableTags}
              showDate={showDate}
            />
          )}
        </>
      )}

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
            onToggle={!showArchived ? toggleItem : undefined}
            onNotesChange={!showArchived ? updateItemNotes : undefined}
            showDate={showDate}
          />
        ))}
      </div>
    </div>
  );
}