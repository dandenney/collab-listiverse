import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Check } from "lucide-react";
import { BaseItem } from "@/types/list";
import { useToast } from "@/hooks/use-toast";
import { useTags } from "@/hooks/useTags";
import { ItemHeader } from "./ItemHeader";
import { ItemDescription } from "./ItemDescription";
import { ItemTags } from "./ItemTags";
import { ItemNotes } from "./ItemNotes";

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
    if (!tag || editingTags.includes(tag.name)) return;
    setEditingTags([...editingTags, tag.name]);
  };

  const removeTag = (tagName: string) => {
    setEditingTags(editingTags.filter(t => t !== tagName));
  };

  return (
    <Card className={`p-4 ${item.completed ? "bg-muted" : ""}`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
          <ItemHeader
            title={item.title}
            url={item.url}
            completed={item.completed}
            date={item.date}
            isEditing={isEditing}
            editingTitle={editingTitle}
            showDate={showDate}
            onTitleChange={setEditingTitle}
          />
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

        <ItemDescription
          description={item.description || ""}
          completed={item.completed}
          isEditing={isEditing}
          isExpanded={isExpanded}
          editingDescription={editingDescription}
          onDescriptionChange={setEditingDescription}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />

        <ItemTags
          tags={isEditing ? editingTags : (item.tags || [])}
          isEditing={isEditing}
          availableTags={availableTags}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

        <ItemNotes
          notes={item.notes || ""}
          isEditing={isEditing}
          editingNotes={editingNotes}
          onNotesChange={setEditingNotes}
        />

        {isEditing && (
          <Button
            size="sm"
            onClick={saveChanges}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </Button>
        )}
      </div>
    </Card>
  );
}