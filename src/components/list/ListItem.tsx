import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit2, Check, Tag as TagIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { BaseItem } from "@/types/list";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTags } from "@/hooks/useTags";

interface ListItemProps {
  item: BaseItem;
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
  showDate?: boolean;
}

export function ListItem({
  item,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onNotesChange,
  showDate = false
}: ListItemProps) {
  const [editingTitle, setEditingTitle] = useState(item.title);
  const [editingDescription, setEditingDescription] = useState(item.description || "");
  const [editingNotes, setEditingNotes] = useState(item.notes || "");
  const [editingTags, setEditingTags] = useState(item.tags || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { data: availableTags = [] } = useTags();

  const startEditing = () => {
    setEditingTitle(item.title);
    setEditingDescription(item.description || "");
    setEditingNotes(item.notes || "");
    setEditingTags(item.tags || []);
    setIsEditing(true);
  };

  const saveChanges = () => {
    if (onNotesChange) {
      // For now we're still only saving notes since that's what the backend supports
      onNotesChange(item.id, editingNotes);
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Your changes have been updated"
      });
    }
  };

  const addTag = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (!tag) return;

    if (editingTags.includes(tag.name)) return;
    setEditingTags([...editingTags, tag.name]);
  };

  const removeTag = (tagName: string) => {
    setEditingTags(editingTags.filter(t => t !== tagName));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return localDate.toLocaleDateString();
  };

  return (
    <Card
      className={`p-4 ${item.completed ? "bg-muted" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="font-medium"
                />
                <Textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="min-h-[60px]"
                />
              </div>
            ) : (
              <>
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
                {showDate && item.date && (
                  <div className="text-sm font-medium text-foreground/90 mt-1">
                    {formatDate(item.date)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2 self-start">
            {onNotesChange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={isEditing ? saveChanges : startEditing}
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </Button>
            )}
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onToggle(item.id);
                }}
              >
                {item.completed ? uncompleteButtonText : completeButtonText}
              </Button>
            )}
          </div>
        </div>
        {!isEditing && item.description && (
          <div>
            <p className={`text-sm text-muted-foreground ${
              item.completed ? "line-through" : ""
            } ${!isExpanded ? "line-clamp-4" : ""}`}>
              {item.description}
            </p>
            {item.description.split('\n').length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 h-6 px-2"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        )}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingTags.map((tag) => (
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
            <Textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[100px]"
            />
            <Button
              size="sm"
              onClick={saveChanges}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <>
            {item.notes && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
              </div>
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
          </>
        )}
      </div>
    </Card>
  );
}