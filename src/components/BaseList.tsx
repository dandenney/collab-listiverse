import { useState } from "react";
import { BaseItem, PendingItem, ListType } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListHeader } from "./list/ListHeader";
import { ListItems } from "./list/ListItems";
import { useListItems } from "@/hooks/useListItems";
import { useTags } from "@/hooks/useTags";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  listType: ListType;
  showDate?: boolean;
  isUrlRequired?: boolean;
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  listType,
  showDate = false,
  isUrlRequired = true
}: BaseListProps) {
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const {
    query: { data: items = [], isLoading: isLoadingItems },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  } = useListItems(listType, showArchived);

  const { tags = [], isLoading: isLoadingTags } = useTags(listType);

  const handlePendingItem = (item: PendingItem) => {
    console.log('Received pending item in BaseList:', item);
    setPendingItem(item);
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    let itemDate = pendingItem.date;
    if (itemDate) {
      const date = new Date(itemDate);
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const offset = localDate.getTimezoneOffset();
      const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
      itemDate = adjustedDate.toISOString();
    }

    const newItem = {
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false,
      tags: pendingItem.tags,
      date: itemDate,
      notes: pendingItem.notes || "",
      image: pendingItem.image
    };

    console.log('Saving pending item:', newItem);
    
    addItemMutation.mutate(newItem);
    setPendingItem(null);
  };

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      toggleItemMutation.mutate({ id, completed: !item.completed });
    }
  };

  const updateItem = (id: string, notes: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    updateItemMutation.mutate({
      ...item,
      notes
    });
  };

  if (isLoadingItems || isLoadingTags) {
    return <div>Loading...</div>;
  }

  const hasCompletedItems = items.some(item => item.completed);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ListHeader
        title={title}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
        onArchiveCompleted={() => archiveCompletedMutation.mutate()}
        hasCompletedItems={hasCompletedItems}
      />

      {!showArchived && (
        <>
          <AddItemForm 
            urlPlaceholder={urlPlaceholder}
            onPendingItem={handlePendingItem}
            isUrlRequired={isUrlRequired}
          />

          {pendingItem && (
            <ItemEditor
              pendingItem={pendingItem}
              onPendingItemChange={setPendingItem}
              onSave={savePendingItem}
              availableTags={tags}
              showDate={showDate}
              listType={listType}
            />
          )}
        </>
      )}

      <ListItems
        items={items}
        completeButtonText={completeButtonText}
        uncompleteButtonText={uncompleteButtonText}
        onToggle={!showArchived ? toggleItem : undefined}
        onNotesChange={!showArchived ? updateItem : undefined}
        showDate={showDate}
      />
    </div>
  );
}