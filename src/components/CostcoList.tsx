
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
    query: { data: items = [], isLoading },
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
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) return;
    
    archiveCompletedMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Completed items archived");
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
