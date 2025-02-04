import { BaseItem } from "@/types/list";
import { ExternalLink } from "lucide-react";
import { ItemHeader } from "../ItemHeader";
import { ItemDescription } from "../ItemDescription";
import { ItemTags } from "../ItemTags";
import { ItemNotes } from "../ItemNotes";
import { Input } from "@/components/ui/input";

interface ItemContentProps {
  item: BaseItem;
  isEditing: boolean;
  isExpanded: boolean;
  editingTitle: string;
  editingDescription: string;
  editingNotes: string;
  editingTags: string[];
  editingImage: string;
  showDate?: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onToggleExpand: () => void;
  availableTags: any[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagName: string) => void;
}

export function ItemContent({
  item,
  isEditing,
  isExpanded,
  editingTitle,
  editingDescription,
  editingNotes,
  editingTags,
  editingImage,
  showDate,
  onTitleChange,
  onDescriptionChange,
  onNotesChange,
  onImageChange,
  onToggleExpand,
  availableTags,
  onAddTag,
  onRemoveTag
}: ItemContentProps) {
  return (
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
          onTitleChange={onTitleChange}
        />

        {isEditing && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              type="url"
              placeholder="Enter image URL..."
              value={editingImage}
              onChange={(e) => onImageChange(e.target.value)}
              className="w-full"
            />
            {editingImage && (
              <div className="relative h-32 bg-slate-50 rounded overflow-hidden">
                <img
                  src={editingImage}
                  alt={editingTitle}
                  className="w-full h-full object-contain"
                  onError={() => onImageChange("")}
                />
              </div>
            )}
          </div>
        )}

        <ItemDescription
          description={item.description || ""}
          completed={item.completed}
          isEditing={isEditing}
          isExpanded={isExpanded}
          editingDescription={editingDescription}
          onDescriptionChange={onDescriptionChange}
          onToggleExpand={onToggleExpand}
        />

        <ItemTags
          tags={isEditing ? editingTags : (item.tags || [])}
          isEditing={isEditing}
          availableTags={availableTags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />

        <ItemNotes
          notes={item.notes || ""}
          isEditing={isEditing}
          editingNotes={editingNotes}
          onNotesChange={onNotesChange}
        />
      </div>
    </div>
  );
}