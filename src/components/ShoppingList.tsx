import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import mql from '@microlink/mql';

interface ShoppingItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  completed: boolean;
}

// Define the type for the metadata we expect from mql
interface Metadata {
  title?: string;
  description?: string;
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
      
      // Fetch metadata using microlink and handle type assertion
      const response = await mql(newUrl);
      // Cast the response to include data property
      const metadata = (response as { data: Metadata }).data;
      
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        url: newUrl.trim(),
        title: metadata.title || new URL(newUrl).hostname,
        description: metadata.description,
        completed: false
      };
      
      setItems([...items, newItem]);
      setNewUrl("");
    } catch (error) {
      toast({
        title: "Error adding item",
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
            className={`p-4 ${
              item.completed ? "bg-muted" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-blue-600 hover:underline ${
                    item.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item.title}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleItem(item.id);
                  }}
                >
                  {item.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
              </div>
              {item.description && (
                <p className={`text-sm text-muted-foreground ${
                  item.completed ? "line-through" : ""
                }`}>
                  {item.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}