import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ShoppingItem {
  id: string;
  url: string;
  title: string;
  completed: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const { toast } = useToast();

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      // Basic URL validation
      new URL(newUrl);
      
      // In a real implementation, we would fetch metadata from the URL here
      // For now, we'll just use the URL as the title
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        url: newUrl.trim(),
        title: new URL(newUrl).hostname,
        completed: false
      };
      
      setItems([...items, newItem]);
      setNewUrl("");
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping List</h1>
      </div>

      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter product URL..."
          type="url"
          className="flex-1"
        />
        <Button type="submit" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-accent/5 ${
              item.completed ? "bg-muted" : ""
            }`}
            onClick={() => openUrl(item.url)}
          >
            <div className="flex items-center justify-between">
              <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                {item.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {item.completed ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}