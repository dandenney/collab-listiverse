import { BaseItem } from "@/types/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ItemHeader } from "./ItemHeader";
import { ItemDescription } from "./ItemDescription";
import { ItemNotes } from "./ItemNotes";
import { ItemTags } from "./ItemTags";
import { useState } from "react";

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
  const [editingNotes, setEditingNotes] = useState(item.notes || "");

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        
        <div className="flex items-start justify-between gap-4">
          <ItemHeader
            title={item.title}
            url={item.url || null}
            completed={item.completed}
            date={item.date}
            isEditing={isEditing}
            editingTitle={item.title}
            showDate={showDate}
            onTitleChange={() => {}}
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

        <ItemDescription
          description={item.description || ""}
          completed={item.completed}
          isEditing={isEditing}
          isExpanded={false}
          editingDescription=""
          onDescriptionChange={() => {}}
          onToggleExpand={() => {}}
        />
        
        {item.tags && item.tags.length > 0 && (
          <ItemTags
            tags={item.tags}
            isEditing={isEditing}
            availableTags={[]}
            onAddTag={() => {}}
            onRemoveTag={() => {}}
          />
        )}

        {onNotesChange && (
          <ItemNotes
            notes={item.notes || ""}
            isEditing={isEditing}
            editingNotes={editingNotes}
            onNotesChange={(notes) => {
              setEditingNotes(notes);
              onNotesChange(item.id, notes);
            }}
          />
        )}
      </div>
    </Card>
  );
}