import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";
import { BaseItem } from "@/types/list";

interface ItemActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onToggle?: (id: string) => void;
  item: BaseItem;
  completeButtonText: string;
  uncompleteButtonText: string;
}

export function ItemActions({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onToggle,
  item,
  completeButtonText,
  uncompleteButtonText
}: ItemActionsProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-between w-full">
      <Button
        variant="outline"
        size="icon"
        onClick={onEdit}
      >
        <Edit2 className="w-4 h-4" />
      </Button>
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
  );
}