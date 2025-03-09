
import { useState } from "react";
import { useListItems } from "@/hooks/useListItems";
import { CostcoListHeader } from "./costco/CostcoListHeader";
import { toast } from "sonner";
import { CostcoItemList } from "./costco/CostcoItemList";
import { useCostcoItemToggler } from "@/hooks/costco/useCostcoItemToggler";
import { useCostcoItemEditor } from "./costco/CostcoItemEditor";
import { CostcoAddItem } from "./costco/CostcoAddItem";

export function CostcoList() {
  const [showArchived, setShowArchived] = useState(false);

  const {
    query: { data: items = [], isLoading, refetch },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation,
  } = useListItems("costco", showArchived);

  // Item toggling logic
  const { 
    toggleItem,
    getEffectiveCompletedState
  } = useCostcoItemToggler(items, toggleItemMutation);

  // Item editing logic
  const {
    editingItem,
    setEditingItem,
    handleKeyDown,
    handleBlur,
    startEditing
  } = useCostcoItemEditor({
    items,
    updateItemMutation,
    showArchived
  });

  const archiveCompleted = () => {
    // Apply effective completed states to determine which items to archive
    const completedItems = items.filter(item => getEffectiveCompletedState(item));
    
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
        editingItemId={editingItem?.id || null}
        editingTitle={editingItem?.title || ""}
        onToggleItem={toggleItem}
        onEditingTitleChange={(value) => setEditingItem({ 
          id: editingItem?.id || "", 
          title: value 
        })}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDoubleClick={startEditing}
        getEffectiveCompletedState={getEffectiveCompletedState}
      />
    </div>
  );
}
