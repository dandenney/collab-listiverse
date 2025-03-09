
import { BaseItem } from "@/types/list";
import { CostcoItem } from "./CostcoItem";

interface CostcoItemListProps {
  items: BaseItem[];
  editingItemId: string | null;
  editingTitle: string;
  onToggleItem: (id: string) => void;
  onEditingTitleChange: (value: string) => void;
  onBlur: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
  onDoubleClick: (item: BaseItem) => void;
  getEffectiveCompletedState: (item: BaseItem) => boolean;
}

export function CostcoItemList({
  items,
  editingItemId,
  editingTitle,
  onToggleItem,
  onEditingTitleChange,
  onBlur,
  onKeyDown,
  onDoubleClick,
  getEffectiveCompletedState
}: CostcoItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const effectiveCompletedState = getEffectiveCompletedState(item);
        
        console.log(`Rendering item ${item.id}: DB completed=${item.completed}, effective=${effectiveCompletedState}`);
          
        return (
          <CostcoItem
            key={item.id}
            id={item.id}
            title={item.title}
            completed={effectiveCompletedState}
            isEditing={editingItemId === item.id}
            editingTitle={editingItemId === item.id ? editingTitle : item.title}
            onToggle={() => onToggleItem(item.id)}
            onEditingTitleChange={(value) => onEditingTitleChange(value)}
            onBlur={() => onBlur(item.id)}
            onKeyDown={(e) => onKeyDown(e, item.id)}
            onDoubleClick={() => onDoubleClick(item)}
          />
        );
      })}
    </div>
  );
}
