import { useState } from "react";
import { Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface GroceryItem {
  id: string;
  text: string;
  completed: boolean;
}

export function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const { toast } = useToast();

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    setItems([
      ...items,
      { id: crypto.randomUUID(), text: newItem.trim(), completed: false }
    ]);
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
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
    
    setItems(items.filter(item => !item.completed));
    toast({
      title: "Items Archived",
      description: `${completedItems.length} items have been archived`
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grocery List</h1>
        <Button
          variant="outline"
          onClick={archiveCompleted}
          className="flex items-center gap-2"
        >
          <Archive className="w-4 h-4" />
          Archive Completed
        </Button>
      </div>

      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item..."
          className="flex-1"
        />
        <Button type="submit" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
            />
            <span className={item.completed ? "line-through text-muted-foreground" : ""}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}