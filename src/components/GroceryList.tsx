import { useState } from "react";
import { Plus, Archive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useListItems } from "@/hooks/useListItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    query: { data: items = [] },
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

  const updateItemTitle = (id: string, newTitle: string) => {
    console.log('Attempting to update item:', id, 'with new title:', newTitle);
    
    if (!newTitle.trim()) return;
    
    const item = items.find(item => item.id === id);
    if (!item) {
      console.log('Item not found:', id);
      return;
    }

    console.log('Found item:', item);
    console.log('Current title:', item.title);
    console.log('New title:', newTitle.trim());

    updateItemMutation.mutate({
      ...item,
      title: newTitle.trim()
    }, {
      onSuccess: () => {
        console.log('Update successful');
        toast({
          title: "Item Updated",
          description: `Changed "${item.title}" to "${newTitle.trim()}"`,
        });
      },
      onError: (error) => {
        console.error('Update failed:', error);
        toast({
          title: "Update Failed",
          description: "Could not update the item. Please try again.",
          variant: "destructive"
        });
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Grocery List</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          <Button
            variant="ghost"
            onClick={refreshMetadata}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Images"}
          </Button>
          {!showArchived && (
            <Button
              variant="ghost"
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
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item..."
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
              />
              {editingItem?.id === item.id ? (
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  onBlur={() => handleBlur(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  autoFocus
                  className="flex-1"
                />
              ) : (
                <span
                  className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                  onDoubleClick={() => !showArchived && setEditingItem({ id: item.id, title: item.title })}
                >
                  {item.title}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}