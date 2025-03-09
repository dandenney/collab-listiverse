
import { useState } from "react";
import { BaseItem } from "@/types/list";
import { toast } from "sonner";

interface EditingItem {
  id: string;
  title: string;
}

interface CostcoItemEditorProps {
  items: BaseItem[];
  updateItemMutation: any;
  showArchived: boolean;
}

export function useCostcoItemEditor({
  items,
  updateItemMutation,
  showArchived
}: CostcoItemEditorProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

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
      toast.success("Item updated successfully");
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

  const startEditing = (item: BaseItem) => {
    if (!showArchived) {
      setEditingItem({ id: item.id, title: item.title });
    }
  };

  return {
    editingItem,
    setEditingItem,
    handleKeyDown,
    handleBlur,
    startEditing
  };
}
