import React from 'react';
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "@/types/list";

interface ItemTagsProps {
  tags: string[];
  isEditing: boolean;
  availableTags: Tag[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagName: string) => void;
}

export function ItemTags({
  tags,
  isEditing,
  availableTags,
  onAddTag,
  onRemoveTag
}: ItemTagsProps) {
  if (!tags?.length && !isEditing) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {isEditing ? (
        <div className="w-full space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10"
              >
                <span className="text-sm">{tag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => onRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Select onValueChange={onAddTag}>
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
      ) : (
        tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10"
          >
            <TagIcon className="w-3 h-3" />
            <span className="text-sm">{tag}</span>
          </div>
        ))
      )}
    </div>
  );
}