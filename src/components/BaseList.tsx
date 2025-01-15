import { useState } from "react";
import { Plus, Tag as TagIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import mql from '@microlink/mql';
import { BaseItem, Metadata, PendingItem, Tag } from "@/types/list";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  onSaveItem: (item: BaseItem) => void;
  availableTags?: Tag[];
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  onSaveItem,
  availableTags = []
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
        description: metadata.description,
        tags: []
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
      completed: false,
      tags: pendingItem.tags,
      date: pendingItem.date
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

  const addTagToPendingItem = (tagId: string) => {
    if (!pendingItem) return;
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;

    const currentTags = pendingItem.tags || [];
    if (currentTags.includes(tag.name)) return;

    setPendingItem({
      ...pendingItem,
      tags: [...currentTags, tag.name]
    });
  };

  const removeTagFromPendingItem = (tagName: string) => {
    if (!pendingItem) return;
    setPendingItem({
      ...pendingItem,
      tags: (pendingItem.tags || []).filter(t => t !== tagName)
    });
  };

  // Sort items: dated items first (sorted by date), then undated items
  const sortedItems = [...items].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

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
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input 
                type="date"
                value={pendingItem.date || ""}
                onChange={(e) => setPendingItem({
                  ...pendingItem,
                  date: e.target.value
                })}
              />
            </div>
            {availableTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(pendingItem.tags || []).map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10"
                    >
                      <span className="text-sm">{tag}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeTagFromPendingItem(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Select onValueChange={addTagToPendingItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add tag..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={savePendingItem} className="w-full">
              Save to List
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <Card
            key={item.id}
            className={`p-4 ${
              item.completed ? "bg-muted" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
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
                  {item.date && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
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
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10"
                    >
                      <TagIcon className="w-3 h-3" />
                      <span className="text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}