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
      // Ensure we keep the exact date entered by the user
      const [year, month, day] = itemDate.split('-');
      itemDate = `${year}-${month}-${day}`;
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

  const updateItem = (id: string, updates: Partial<BaseItem>) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    updateItemMutation.mutate({
      ...item,
      ...updates
    });
  };

  if (isLoadingItems || isLoadingTags) {
    return <div>Loading...</div>;
  }

  const hasCompletedItems = items.some(item => item.completed);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
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
              showDate={showDate}
              listType={listType}
            />
          )}
        </>
      )}

      <div className="@container mt-6">
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-8">
          <ListItems
            items={items}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
            onToggle={!showArchived ? toggleItem : undefined}
            updateItem={updateItem}
            showDate={showDate}
            listType={listType}
          />
        </div>
      </div>
    </div>
  );
}
