import { useState } from "react";
import { BaseList } from "./BaseList";
import { BaseItem, Tag } from "@/types/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LocalList() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Important", color: "bg-red-500" },
    { id: "2", name: "Later", color: "bg-yellow-500" },
    { id: "3", name: "Reference", color: "bg-blue-500" },
  ]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleSaveItem = (item: BaseItem) => {
    console.log("Saved local item:", item);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    const tagExists = tags.some(tag => 
      tag.name.toLowerCase() === newTag.trim().toLowerCase()
    );

    if (tagExists) {
      toast({
        title: "Tag already exists",
        description: "Please use a different tag name",
        variant: "destructive"
      });
      return;
    }

    const tag: Tag = {
      id: crypto.randomUUID(),
      name: newTag.trim(),
      color: `bg-${['red', 'yellow', 'blue', 'green', 'purple'][Math.floor(Math.random() * 5)]}-500`
    };

    setTags([...tags, tag]);
    setNewTag("");
    toast({
      title: "Tag added",
      description: "The new tag has been created"
    });
  };

  const removeTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
    toast({
      title: "Tag removed",
      description: "The tag has been deleted"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Manage Tags
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag..."
                  className="flex-1"
                />
                <Button onClick={addTag} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                      <span>{tag.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BaseList
        title="Local List"
        urlPlaceholder="Enter URL..."
        completeButtonText="Mark Complete"
        uncompleteButtonText="Mark Incomplete"
        onSaveItem={handleSaveItem}
        availableTags={tags}
      />
    </div>
  );
}