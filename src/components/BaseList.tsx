import { useState } from "react";
import { BaseItem, PendingItem, Tag } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListItem } from "./list/ListItem";

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
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);

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
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateItemNotes = (id: string, notes: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  };

  // Sort items: dated items first (sorted by date), then undated items
  const sortedItems = [...items].sort((a, b) => {
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
      </div>

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

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
            onToggle={toggleItem}
            onNotesChange={updateItemNotes}
            showDate={showDate}
          />
        ))}
      </div>
    </div>
  );
}