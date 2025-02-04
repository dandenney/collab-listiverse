import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { BaseItem, ListType } from "@/types/list";
import { useTags } from "@/hooks/useTags";
import { ItemActions } from "./item/ItemActions";
import { ItemContent } from "./item/ItemContent";
import { animate, motion } from "@motionone/dom";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const startEditing = () => {
    setEditingTitle(item.title);
    setEditingDescription(item.description || "");
    setEditingNotes(item.notes || "");
    setEditingTags(item.tags || []);
    setEditingImage(item.image || "");
    setIsEditing(true);
    setIsExpanded(true);
    
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
    
    if (hasChanges && onUpdate) {
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

  const formatDate = (dateString: string) => {
    try {
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      const date = new Date(+year, +month - 1, +day);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ 
        height: isExpanded ? "auto" : isMobile ? "80px" : "fit-content",
        transition: { duration: 0.3 }
      }}
    >
      <Card 
        className={`flex flex-col h-full group overflow-hidden relative cursor-pointer ${
          item.completed ? "bg-muted" : ""
        } ${
          !isExpanded ? "hover:bg-accent/5" : ""
        }`}
        data-item-id={item.id}
        onClick={handleCardClick}
      >
        {(item.image || isEditing) && (
          <motion.div 
            layout="position"
            className="bg-slate-50 border-b relative rounded-t h-48 p-4 w-full"
          >
            {isEditing ? (
              <div className="h-full flex flex-col gap-2">
                <Input
                  type="url"
                  placeholder="Enter image URL..."
                  value={editingImage}
                  onChange={(e) => setEditingImage(e.target.value)}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                {editingImage && (
                  <div className="flex-1 relative">
                    <img
                      src={editingImage}
                      alt={editingTitle}
                      className="w-full h-full object-cover rounded"
                      onError={() => setEditingImage("")}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </>
            )}
          </motion.div>
        )}

        <motion.div 
          layout="position"
          className="p-4 flex-grow"
        >
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${item.completed ? "line-through text-muted-foreground" : ""}`}>
              {item.title}
            </h3>
            {showDate && item.date && (
              <span className="text-sm text-muted-foreground">
                {formatDate(item.date)}
              </span>
            )}
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
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
                  const tag = availableTags.find(t => t.id === tagId);
                  if (!tag || editingTags.includes(tag.name)) return;
                  setEditingTags([...editingTags, tag.name]);
                }}
                onRemoveTag={(tagName) => {
                  setEditingTags(editingTags.filter(t => t !== tagName));
                }}
              />
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          layout="position"
          className={`absolute bottom-0 bg-slate-50 border-t ease-in-out left-0 mt-auto p-2 right-0 ${
            isExpanded ? "translate-y-0" : "translate-y-16"
          } transition-transform group-hover:translate-y-0`}
        >
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
        </motion.div>
      </Card>
    </motion.div>
  );
}