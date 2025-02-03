import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { BaseItem, ListType } from "@/types/list";
import { useTags } from "@/hooks/useTags";
import { ItemActions } from "./item/ItemActions";
import { ItemContent } from "./item/ItemContent";
import { animate } from "@motionone/dom";
import { Input } from "@/components/ui/input";

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
  const [editingImage, setEditingImage] = useState(item.image || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { tags: availableTags = [] } = useTags(listType);

  const startEditing = () => {
    console.log('Starting edit mode with current item:', item);
    setEditingTitle(item.title);
    setEditingDescription(item.description || "");
    setEditingNotes(item.notes || "");
    setEditingTags(item.tags || []);
    setEditingImage(item.image || "");
    setIsEditing(true);
    
    const card = document.querySelector(`[data-item-id="${item.id}"]`);
    if (card) {
      animate(
        card,
        { 
          scale: [1, 1.02],
          backgroundColor: ['rgb(255, 255, 255)', 'rgb(249, 250, 251)']
        },
        { duration: 0.2 }
      );
    }
  };

  const saveChanges = () => {
    console.log('Attempting to save changes...');
    console.log('Current item:', item);
    console.log('Editing state:', {
      title: editingTitle,
      description: editingDescription,
      notes: editingNotes,
      tags: editingTags,
      image: editingImage
    });

    const updates: Partial<BaseItem> = {};
    
    if (editingTitle !== item.title) {
      updates.title = editingTitle;
    }
    
    if (editingDescription !== item.description) {
      updates.description = editingDescription;
    }
    
    if (editingNotes !== item.notes) {
      updates.notes = editingNotes;
    }
    
    if (JSON.stringify(editingTags) !== JSON.stringify(item.tags)) {
      updates.tags = editingTags;
    }

    if (editingImage !== item.image) {
      updates.image = editingImage || null;
    }

    const hasChanges = Object.keys(updates).length > 0;
    console.log('Updates to be saved:', updates);
    console.log('Has changes:', hasChanges);
    
    if (hasChanges && onUpdate) {
      console.log('Calling onUpdate with:', { id: item.id, updates });
      onUpdate(item.id, updates);
    }

    setIsEditing(false);
    
    const card = document.querySelector(`[data-item-id="${item.id}"]`);
    if (card) {
      animate(
        card,
        { 
          scale: [1.02, 1],
          backgroundColor: ['rgb(249, 250, 251)', 'rgb(255, 255, 255)']
        },
        { duration: 0.2 }
      );
    }
  };

  return (
    <Card 
      className={`flex flex-col h-full group overflow-hidden relative ${item.completed ? "bg-muted" : ""}`}
      data-item-id={item.id}
    >
      {(item.image || isEditing) && (
        <div className="bg-slate-50 border-b relative h-48 p-4 w-full">
          {isEditing ? (
            <div className="h-full flex flex-col gap-2">
              <Input
                type="url"
                placeholder="Enter image URL..."
                value={editingImage}
                onChange={(e) => setEditingImage(e.target.value)}
                className="w-full"
              />
              {editingImage && (
                <div className="flex-1 relative overflow-hidden">
                  <img
                    src={editingImage}
                    alt={editingTitle}
                    className="w-full h-full object-contain"
                    onError={() => setEditingImage("")}
                  />
                </div>
              )}
            </div>
          ) : item.image && (
            <div className="h-full relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
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
            onCancel={() => {
              setIsEditing(false);
              setEditingImage(item.image || "");
              const card = document.querySelector(`[data-item-id="${item.id}"]`);
              if (card) {
                animate(
                  card,
                  { 
                    scale: [1.02, 1],
                    backgroundColor: ['rgb(249, 250, 251)', 'rgb(255, 255, 255)']
                  },
                  { duration: 0.2 }
                );
              }
            }}
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