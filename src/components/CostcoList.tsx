import { useState } from "react";
import { useListItems } from "@/hooks/useListItems";
import { CostcoListHeader } from "./costco/CostcoListHeader";
import { AddCostcoItem } from "./costco/AddCostcoItem";
import { CostcoItem } from "./costco/CostcoItem";
import { toast } from "sonner";

interface EditingItem {
  id: string;
  title: string;
}

export function CostcoList() {
  const [newItem, setNewItem] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

  const {
    query: { data: items = [], isLoading, refetch },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation,
    queryClient,
  } = useListItems("costco", showArchived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: "",
      title: newItem.trim(),
      description: "",
      completed: false,
      tags: [],
      notes: ""
    }, {
      onSuccess: () => {
        console.log("Item added successfully");
        setNewItem("");
        toast.success("Item added successfully");
      },
      onError: (error) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add item");
      }
    });
  };

  const toggleItem = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) {
      console.error(`Item with ID ${id} not found when trying to toggle`);
      return;
    }

    const newCompletedState = !item.completed;
    console.log(`Toggling costco item: ${id} from ${item.completed} to ${newCompletedState}`);
    
    // Optimistically update UI
    setPendingToggles(prev => ({ ...prev, [id]: newCompletedState }));
    
    try {
      await toggleItemMutation.mutateAsync({ 
        id, 
        completed: newCompletedState 
      });
      console.log(`Successfully toggled item: ${id} to ${newCompletedState}`);
      
      // Keep the pendingToggle state until the next refetch to prevent flickering
      // Only remove from pending state when invalidateQueries completes
      queryClient.invalidateQueries({ 
        queryKey: ['items', 'costco'],
        exact: false
      }).then(() => {
        // After refetch completes, we can safely remove the pending state
        setPendingToggles(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      });
    } catch (error) {
      console.error(`Exception when toggling item: ${id}`, error);
      // Revert optimistic update on error
      setPendingToggles(prev => ({ ...prev, [id]: item.completed }));
      toast.error("Failed to update item status");
    }
  };

  const updateItemTitle = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    const item = items.find(item => item.id === id);
    if (!item) {
      console.error(`Item with ID ${id} not found when trying to update title`);
      return;
    }

    console.log(`Updating item title: ${id} Current: "${item.title}" New: "${newTitle.trim()}"`);
    
    const updatedItem = {
      ...item,
      title: newTitle.trim()
    };
    
    try {
      await updateItemMutation.mutateAsync(updatedItem);
      console.log(`Successfully updated item title: ${id}`);
      setEditingItem(null);
    } catch (error) {
      console.error(`Exception when updating item title: ${id}`, error);
      toast.error("Failed to update item");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(`Enter key pressed for item: ${id}`);
      if (editingItem) {
        updateItemTitle(id, editingItem.title);
      }
    } else if (e.key === "Escape") {
      console.log(`Escape key pressed for item: ${id}, cancelling edit`);
      setEditingItem(null);
    }
  };

  const handleBlur = (id: string) => {
    console.log(`Input blurred for item: ${id}`);
    if (editingItem) {
      updateItemTitle(id, editingItem.title);
    }
  };

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
        <AddCostcoItem
          newItem={newItem}
          onNewItemChange={setNewItem}
          onSubmit={handleSubmit}
        />
      )}

      <div className="space-y-2">
        {items.map((item) => {
          // Use the pending toggle state if it exists, otherwise use the item's state
          const effectiveCompletedState = item.id in pendingToggles 
            ? pendingToggles[item.id] 
            : item.completed;
            
          return (
            <CostcoItem
              key={item.id}
              id={item.id}
              title={item.title}
              completed={effectiveCompletedState}
              isEditing={editingItem?.id === item.id}
              editingTitle={editingItem?.title || item.title}
              onToggle={() => toggleItem(item.id)}
              onEditingTitleChange={(value) => setEditingItem({ id: item.id, title: value })}
              onBlur={() => handleBlur(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              onDoubleClick={() => !showArchived && setEditingItem({ id: item.id, title: item.title })}
            />
          );
        })}
      </div>
    </div>
  );
}
