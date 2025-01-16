import { useState } from "react";
import { useListItems } from "@/hooks/useListItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GroceryListHeader } from "./grocery/GroceryListHeader";
import { AddGroceryItem } from "./grocery/AddGroceryItem";
import { GroceryItem } from "./grocery/GroceryItem";

interface EditingItem {
  id: string;
  title: string;
}

export function GroceryList() {
  const [newItem, setNewItem] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const { toast } = useToast();

  const {
    query: { data: items = [], refetch },
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation,
  } = useListItems("grocery", showArchived);

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
    });
    
    setNewItem("");
  };

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

    try {
      const updatedItem = {
        ...item,
        title: newTitle.trim()
      };
      
      await updateItemMutation.mutateAsync(updatedItem, {
        onSuccess: () => {
          refetch();
        }
      });
      
      toast({
        title: "Item Updated",
        description: `Changed "${item.title}" to "${newTitle.trim()}"`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update the item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEditingItem(null);
    }
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
      toast({
        title: "No items to archive",
        description: "Complete some items first!",
        variant: "destructive"
      });
      return;
    }
    
    archiveCompletedMutation.mutate();
  };

  const refreshMetadata = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-metadata');
      
      if (error) throw error;
      
      toast({
        title: "Metadata Refresh Complete",
        description: `Processed ${data.processed} items with ${data.errors} errors`,
      });
    } catch (error) {
      toast({
        title: "Error Refreshing Metadata",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GroceryListHeader
        showArchived={showArchived}
        isRefreshing={isRefreshing}
        onToggleArchived={() => setShowArchived(!showArchived)}
        onRefreshMetadata={refreshMetadata}
        onArchiveCompleted={archiveCompleted}
      />

      {!showArchived && (
        <AddGroceryItem
          newItem={newItem}
          onNewItemChange={setNewItem}
          onSubmit={handleSubmit}
        />
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <GroceryItem
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