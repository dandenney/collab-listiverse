import { useState } from "react";
import { BaseItem } from "@/types/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ItemHeader } from "./ItemHeader";
import { ItemDescription } from "./ItemDescription";
import { ItemNotes } from "./ItemNotes";
import { ItemTags } from "./ItemTags";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(item.title);
  const [editingDescription, setEditingDescription] = useState(item.description || "");
  const [editingNotes, setEditingNotes] = useState(item.notes || "");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
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
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(item.id)}
              className={item.completed ? "text-primary" : "text-muted-foreground"}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>

        {(item.description || isEditing) && (
          <ItemDescription
            description={item.description || ""}
            completed={item.completed}
            isEditing={isEditing}
            isExpanded={isExpanded}
            editingDescription={editingDescription}
            onDescriptionChange={setEditingDescription}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
        )}
        
        {item.tags && item.tags.length > 0 && (
          <ItemTags
            tags={item.tags}
            isEditing={isEditing}
            availableTags={[]} // You'll need to pass available tags from a parent component
            onAddTag={(tagId) => {
              // Handle adding tag
              console.log('Add tag:', tagId);
            }}
            onRemoveTag={(tagName) => {
              // Handle removing tag
              console.log('Remove tag:', tagName);
            }}
          />
        )}

        {onNotesChange && (
          <ItemNotes
            notes={item.notes || ""}
            isEditing={isEditing}
            editingNotes={editingNotes}
            onNotesChange={setEditingNotes}
          />
        )}
      </div>
    </Card>
  );
}