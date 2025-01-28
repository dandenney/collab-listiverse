import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PendingItem, Tag, ListType } from "@/types/list";
import { useTags } from "@/hooks/useTags";

interface EditorTagsProps {
  pendingItem: PendingItem;
  onPendingItemChange: (item: PendingItem) => void;
  listType: ListType;
}

export function EditorTags({ 
  pendingItem, 
  onPendingItemChange,
  listType
}: EditorTagsProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const { tags: availableTags = [], createTag } = useTags(listType);

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

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    createTag({
      name: newTagName.trim(),
      color: randomColor,
    });

    setNewTagName("");
    setIsAddingTag(false);
  };

  return (
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
      <div className="flex gap-2">
        <Select onValueChange={addTag}>
          <SelectTrigger className="flex-1">
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
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Name</label>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name..."
                />
              </div>
              <Button 
                onClick={handleCreateTag}
                className="w-full"
                disabled={!newTagName.trim()}
              >
                Create Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}