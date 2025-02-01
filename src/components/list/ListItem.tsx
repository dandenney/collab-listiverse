import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { BaseItem, ListType } from "@/types/list";
import { useTags } from "@/hooks/useTags";
import { ItemActions } from "./item/ItemActions";
import { ItemContent } from "./item/ItemContent";

interface ListItemProps {
  item: BaseItem;
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<BaseItem>) => void;
  showDate?: boolean;
  listType: ListType;
}

export function ListItem({
  item,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onUpdate,
  showDate = false,
  listType
}: ListItemProps) {
  const [editingTitle, setEditingTitle] = useState(item.title);
  const [editingDescription, setEditingDescription] = useState(item.description || "");
  const [editingNotes, setEditingNotes] = useState(item.notes || "");
  const [editingTags, setEditingTags] = useState(item.tags || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { tags: availableTags = [] } = useTags(listType);

  const startEditing = () => {
    console.log('Starting edit mode with current item:', item);
    setEditingTitle(item.title);
    setEditingDescription(item.description || "");
    setEditingNotes(item.notes || "");
    setEditingTags(item.tags || []);
    setIsEditing(true);
  };

  const saveChanges = () => {
    console.log('Attempting to save changes...');
    console.log('Current item:', item);
    console.log('Editing state:', {
      title: editingTitle,
      description: editingDescription,
      notes: editingNotes,
      tags: editingTags
    });

    const updates: Partial<BaseItem> = {};
    
    if (editingTitle !== item.title) {
      console.log('Title changed from:', item.title, 'to:', editingTitle);
      updates.title = editingTitle;
    }
    
    if (editingDescription !== item.description) {
      console.log('Description changed from:', item.description, 'to:', editingDescription);
      updates.description = editingDescription;
    }
    
    if (editingNotes !== item.notes) {
      console.log('Notes changed from:', item.notes, 'to:', editingNotes);
      updates.notes = editingNotes;
    }
    
    if (JSON.stringify(editingTags) !== JSON.stringify(item.tags)) {
      console.log('Tags changed from:', item.tags, 'to:', editingTags);
      updates.tags = editingTags;
    }

    const hasChanges = Object.keys(updates).length > 0;
    console.log('Updates to be saved:', updates);
    console.log('Has changes:', hasChanges);
    
    if (hasChanges && onUpdate) {
      console.log('Calling onUpdate with:', { id: item.id, updates });
      onUpdate(item.id, updates);
    } else {
      console.log('No changes to save or onUpdate not provided');
    }

    setIsEditing(false);
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

      <ItemContent
        item={item}
        isEditing={isEditing}
        isExpanded={isExpanded}
        editingTitle={editingTitle}
        editingDescription={editingDescription}
        editingNotes={editingNotes}
        editingTags={editingTags}
        showDate={showDate}
        onTitleChange={setEditingTitle}
        onDescriptionChange={setEditingDescription}
        onNotesChange={setEditingNotes}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        availableTags={availableTags}
        onAddTag={(tagId) => {
          console.log('Adding tag with ID:', tagId);
          const tag = availableTags.find(t => t.id === tagId);
          if (!tag) {
            console.log('Tag not found in available tags');
            return;
          }
          if (editingTags.includes(tag.name)) {
            console.log('Tag already exists in editing tags');
            return;
          }
          const newTags = [...editingTags, tag.name];
          console.log('New tags array:', newTags);
          setEditingTags(newTags);
        }}
        onRemoveTag={(tagName) => {
          console.log('Removing tag:', tagName);
          const newTags = editingTags.filter(t => t !== tagName);
          console.log('New tags array after removal:', newTags);
          setEditingTags(newTags);
        }}
      />

      <div className="absolute bottom-0 bg-slate-50 border-t ease-in-out left-0 mt-auto p-2 right-0 translate-y-16 transition-transform group-hover:translate-y-0">
        <div className="flex items-center">
          <ItemActions
            isEditing={isEditing}
            onEdit={startEditing}
            onSave={saveChanges}
            onCancel={() => setIsEditing(false)}
            onToggle={onToggle}
            item={item}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
          />
        </div>
      </div>
    </Card>
  );
}