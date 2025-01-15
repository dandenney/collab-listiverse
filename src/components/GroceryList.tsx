import { useState } from "react";
import { Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useListItems } from "@/hooks/useListItems";
import { useToast } from "@/hooks/use-toast";

export function GroceryList() {
  const [newItem, setNewItem] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  const {
    query: { data: items = [] },
    addItemMutation,
    toggleItemMutation,
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Grocery List</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowArchived(!showArchived)}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          {!showArchived && (
            <Button
              variant="ghost"
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
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item..."
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
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
              <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                {item.title}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}