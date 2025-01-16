import { useState } from "react";
import { Archive } from "lucide-react";
import { BaseItem, PendingItem, Tag, ListType } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListItem } from "./list/ListItem";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const {
    query: { data: items = [], isLoading: isLoadingItems },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  } = useListItems(listType, showArchived);

  const { data: tags = [], isLoading: isLoadingTags } = useTags();

  const handlePendingItem = (item: PendingItem) => {
    setPendingItem(item);
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    // If there's a date, ensure we're using the correct timezone offset
    let itemDate = pendingItem.date;
    if (itemDate) {
      const date = new Date(itemDate);
      // Set the time to midnight in the local timezone
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      // Convert to ISO string but preserve the local date
      const offset = localDate.getTimezoneOffset();
      const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
      itemDate = adjustedDate.toISOString();
    }

    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false,
      tags: pendingItem.tags,
      date: itemDate,
      notes: pendingItem.notes || "",
      image: pendingItem.image
    });
    
    setPendingItem(null);
  };

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      toggleItemMutation.mutate({ id, completed: !item.completed });
    }
  };

  const updateItem = (id: string, updates: {
    title: string;
    description?: string;
    notes?: string;
    tags?: string[];
  }) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    updateItemMutation.mutate({
      ...item,
      ...updates
    });
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
    
    archiveCompletedMutation.mutate();
  };

  if (isLoadingItems || isLoadingTags) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          {!showArchived && (
            <Button
              variant="outline"
              onClick={archiveCompleted}
              className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
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
            isUrlRequired={isUrlRequired}
          />

          {pendingItem && (
            <ItemEditor
              pendingItem={pendingItem}
              onPendingItemChange={setPendingItem}
              onSave={savePendingItem}
              availableTags={tags}
              showDate={showDate}
            />
          )}
        </>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
            onToggle={!showArchived ? toggleItem : undefined}
            onNotesChange={!showArchived ? (id, notes) => updateItem(id, {
              title: item.title,
              description: item.description,
              notes,
              tags: item.tags
            }) : undefined}
            showDate={showDate}
          />
        ))}
      </div>
    </div>
  );
}
