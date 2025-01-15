import { useState } from "react";
import { Archive } from "lucide-react";
import { BaseItem, PendingItem } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListItem } from "./list/ListItem";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useListItems } from "@/hooks/useListItems";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  onSaveItem: (item: BaseItem) => void;
  listType: 'grocery' | 'shopping' | 'watch' | 'read' | 'local' | 'recipe';
  availableTags?: Tag[];
  showDate?: boolean;
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  listType,
  availableTags = [],
  showDate = false
}: BaseListProps) {
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  const {
    query: { data: items = [], isLoading },
    addItemMutation,
    toggleItemMutation,
    updateNotesMutation,
    archiveCompletedMutation
  } = useListItems(listType, showArchived);

  const handlePendingItem = (item: PendingItem) => {
    setPendingItem(item);
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false,
      tags: pendingItem.tags,
      date: showDate ? pendingItem.date : undefined,
      notes: pendingItem.notes || ""
    });
    
    setPendingItem(null);
  };

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      toggleItemMutation.mutate({ id, completed: !item.completed });
    }
  };

  const updateItemNotes = (id: string, notes: string) => {
    updateNotesMutation.mutate({ id, notes });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {items.map((item) => (
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