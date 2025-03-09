
import { useState } from "react";
import { useListItems } from "@/hooks/useListItems";
import { CostcoListHeader } from "./costco/CostcoListHeader";
import { toast } from "sonner";
import { CostcoAddItem } from "./costco/CostcoAddItem";
import { CostcoItemList } from "./costco/CostcoItemList";

interface EditingItem {
  id: string;
  title: string;
}

export function CostcoList() {
  const [showArchived, setShowArchived] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const {
    query: { data: items = [], refetch, isLoading },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation,
  } = useListItems("costco", showArchived);

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      toggleItemMutation.mutate({ id, completed: !item.completed });
    }
  };

  const updateItemTitle = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    const item = items.find(item => item.id === id);
    if (!item) return;

    const updatedItem = {
      ...item,
      title: newTitle.trim()
    };
    
    await updateItemMutation.mutateAsync(updatedItem, {
      onSuccess: () => {
        refetch();
      }
    });
    
    setEditingItem(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingItem) {
        updateItemTitle(id, editingItem.title);
      }
    } else if (e.key === "Escape") {
      setEditingItem(null);
    }
  };

  const handleBlur = (id: string) => {
    if (editingItem) {
      updateItemTitle(id, editingItem.title);
    }
  };

  const archiveCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) {
      toast.info("No completed items to archive");
      return;
    }
    
    console.log(`Archiving ${completedItems.length} completed items...`);
    
    archiveCompletedMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`${completedItems.length} completed items archived`);
        refetch();
      },
      onError: () => {
        toast.error("Failed to archive items");
      }
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading Costco list...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CostcoListHeader
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
        onArchiveCompleted={archiveCompleted}
      />

      {!showArchived && (
        <CostcoAddItem addItemMutation={addItemMutation} />
      )}

      <CostcoItemList
        items={items}
        editingItem={editingItem}
        onToggle={toggleItem}
        onEditingTitleChange={(value) => setEditingItem({ 
          ...editingItem as EditingItem, 
          title: value 
        })}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDoubleClick={(id) => !showArchived && setEditingItem({ 
          id, 
          title: items.find(item => item.id === id)?.title || "" 
        })}
      />
    </div>
  );
}
