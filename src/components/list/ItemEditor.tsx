import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PendingItem, Tag } from "@/types/list";

interface ItemEditorProps {
  pendingItem: PendingItem;
  onPendingItemChange: (item: PendingItem) => void;
  onSave: () => void;
  availableTags?: Tag[];
}

export function ItemEditor({ 
  pendingItem, 
  onPendingItemChange, 
  onSave,
  availableTags = []
}: ItemEditorProps) {
  const addTag = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;

    const currentTags = pendingItem.tags || [];
    if (currentTags.includes(tag.name)) return;

    onPendingItemChange({
      ...pendingItem,
      tags: [...currentTags, tag.name]
    });
  };

  const removeTag = (tagName: string) => {
    onPendingItemChange({
      ...pendingItem,
      tags: (pendingItem.tags || []).filter(t => t !== tagName)
    });
  };

  return (
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
            onChange={(e) => onPendingItemChange({
              ...pendingItem,
              title: e.target.value
            })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            value={pendingItem.description || ""}
            onChange={(e) => onPendingItemChange({
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
            onChange={(e) => onPendingItemChange({
              ...pendingItem,
              date: e.target.value
            })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Textarea 
            value={pendingItem.notes || ""}
            onChange={(e) => onPendingItemChange({
              ...pendingItem,
              notes: e.target.value
            })}
            placeholder="Add your notes here..."
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
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={addTag}>
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
        <Button onClick={onSave} className="w-full">
          Save to List
        </Button>
      </div>
    </Card>
  );
}