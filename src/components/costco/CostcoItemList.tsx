
import { BaseItem } from "@/types/list";
import { CostcoItem } from "./CostcoItem";

interface CostcoItemListProps {
  items: BaseItem[];
  editingItem: { id: string; title: string; } | null;
  onToggle: (id: string) => void;
  onEditingTitleChange: (value: string) => void;
  onBlur: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function CostcoItemList({
  items,
  editingItem,
  onToggle,
  onEditingTitleChange,
  onBlur,
  onKeyDown,
  onDoubleClick
}: CostcoItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <CostcoItem
          key={item.id}
          id={item.id}
          title={item.title}
          completed={item.completed}
          isEditing={editingItem?.id === item.id}
          editingTitle={editingItem?.title || item.title}
          onToggle={() => onToggle(item.id)}
          onEditingTitleChange={(value) => onEditingTitleChange(value)}
          onBlur={() => onBlur(item.id)}
          onKeyDown={(e) => onKeyDown(e, item.id)}
          onDoubleClick={() => onDoubleClick(item.id)}
        />
      ))}
    </div>
  );
}
