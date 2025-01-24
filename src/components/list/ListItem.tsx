import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Check, ExternalLink } from "lucide-react";
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
  onTitleChange?: (id: string, title: string) => void;
  onDescriptionChange?: (id: string, description: string) => void;
  onTagsChange?: (id: string, tags: string[]) => void;
  showDate?: boolean;
}

export function ListItem({
  item,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onNotesChange,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  showDate = false
}: ListItemProps) {
  const [editingTitle, setEditingTitle] = useState(item.title);
  const [editingDescription, setEditingDescription] = useState(item.description || "");
  const [editingNotes, setEditingNotes] = useState(item.notes || "");
  const [editingTags, setEditingTags] = useState(item.tags || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { tags: availableTags = [] } = useTags();

  const startEditing = () => {
    setEditingTitle(item.title);
    setEditingDescription(item.description || "");
    setEditingNotes(item.notes || "");
    setEditingTags(item.tags || []);
    setIsEditing(true);
  };

  const saveChanges = () => {
    let hasChanges = false;
    
    if (onTitleChange && editingTitle !== item.title) {
      onTitleChange(item.id, editingTitle);
      hasChanges = true;
    }
    
    if (onDescriptionChange && editingDescription !== item.description) {
      onDescriptionChange(item.id, editingDescription);
      hasChanges = true;
    }
    
    if (onNotesChange && editingNotes !== item.notes) {
      onNotesChange(item.id, editingNotes);
      hasChanges = true;
    }
    
    if (onTagsChange && JSON.stringify(editingTags) !== JSON.stringify(item.tags)) {
      onTagsChange(item.id, editingTags);
      hasChanges = true;
    }

    setIsEditing(false);
    
    if (hasChanges) {
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
    <Card className={`flex flex-col h-full group overflow-hidden relative ${item.completed ? "bg-muted" : ""}`}>
      {item.image && (
        <div className="bg-slate-50 border-b relative rounded-t h-48 p-4 w-full">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded"
          />
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
      <div className="p-4 flex-grow">
        <div className="flex flex-col gap-2">
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
        </div>
      </div>

      <div className="absolute bottom-0 bg-slate-50 border-t ease-in-out left-0 mt-auto p-2 right-0 translate-y-16 transition-transform  group-hover:translate-y-0">
        <div className="flex items-center">
          <div className="flex gap-2 justify-between w-full">
            {onNotesChange && (
              <Button
                variant="outline"
                size="icon"
                onClick={isEditing ? saveChanges : startEditing}
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </Button>
            )}
            {onToggle && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onToggle(item.id);
                }}
                title={item.completed ? uncompleteButtonText : completeButtonText}
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
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
      </div>
    </Card>
  );
}