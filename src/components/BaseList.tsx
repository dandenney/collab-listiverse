import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import mql from '@microlink/mql';
import { BaseItem, Metadata, PendingItem } from "@/types/list";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  onSaveItem: (item: BaseItem) => void;
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  onSaveItem
}: BaseListProps) {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const { toast } = useToast();

  const fetchMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      new URL(newUrl);
      const response = await mql(newUrl);
      const metadata = (response as unknown as { data: Metadata }).data;
      
      setPendingItem({
        url: newUrl.trim(),
        title: metadata.title || new URL(newUrl).hostname,
        description: metadata.description
      });
      
      setNewUrl("");
    } catch (error) {
      toast({
        title: "Error fetching metadata",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    const newItem: BaseItem = {
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false
    };
    
    setItems([...items, newItem]);
    onSaveItem(newItem);
    setPendingItem(null);
    toast({
      title: "Item added",
      description: "The item has been added to your list"
    });
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <form onSubmit={fetchMetadata} className="flex gap-2 mb-6">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder={urlPlaceholder}
          type="url"
          className="flex-1"
        />
        <Button type="submit" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Fetch
        </Button>
      </form>

      {pendingItem && (
        <Card className="p-4 mb-6">
          <h2 className="font-semibold mb-4">Edit Item Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <Input value={pendingItem.url} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input 
                value={pendingItem.title}
                onChange={(e) => setPendingItem({
                  ...pendingItem,
                  title: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={pendingItem.description || ""}
                onChange={(e) => setPendingItem({
                  ...pendingItem,
                  description: e.target.value
                })}
              />
            </div>
            <Button onClick={savePendingItem} className="w-full">
              Save to List
            </Button>
          </div>
        </Card>
      )}

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
                  {item.completed ? uncompleteButtonText : completeButtonText}
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