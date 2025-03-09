
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

  const {
    query: { data: items = [], refetch },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation,
  } = useListItems("costco", showArchived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    console.log("Adding new costco item:", newItem.trim());
    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: "",
      title: newItem.trim(),
      description: "",
      completed: false,
      tags: [],
      notes: ""
    });
    
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      console.log("Toggling costco item:", id, "Current completed status:", item.completed);
      toggleItemMutation.mutate({ id, completed: !item.completed });
    } else {
      console.error("Toggle failed: Item not found", id);
    }
  };

  const updateItemTitle = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    const item = items.find(item => item.id === id);
    if (!item) {
      console.error("Update failed: Item not found", id);
      return;
    }

    console.log("Updating costco item title:", id, "Current title:", item.title, "New title:", newTitle.trim());
    
    const updatedItem = {
      ...item,
      title: newTitle.trim()
    };
    
    try {
      await updateItemMutation.mutateAsync(updatedItem);
      console.log("Update successful");
      toast.success("Item updated");
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update item");
    }
    
    setEditingItem(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    console.log("Key pressed:", e.key, "for item:", id);
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
    console.log("Blur event for item:", id);
    if (editingItem) {
      updateItemTitle(id, editingItem.title);
    }
  };

  const archiveCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) return;
    
    console.log("Archiving completed costco items:", completedItems.length);
    archiveCompletedMutation.mutate();
  };

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
        {items.map((item) => (
          <CostcoItem
            key={item.id}
            id={item.id}
            title={item.title}
            completed={item.completed}
            isEditing={editingItem?.id === item.id}
            editingTitle={editingItem?.title || item.title}
            onToggle={() => toggleItem(item.id)}
            onEditingTitleChange={(value) => setEditingItem({ id: item.id, title: value })}
            onBlur={() => handleBlur(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            onDoubleClick={() => !showArchived && setEditingItem({ id: item.id, title: item.title })}
          />
        ))}
      </div>
    </div>
  );
}
