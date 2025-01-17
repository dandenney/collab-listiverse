import { BaseItem } from "@/types/list";
import { ListItem } from "./ListItem";

interface ListItemsProps {
  items: BaseItem[];
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
  showDate?: boolean;
}

export function ListItems({
  items,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onNotesChange,
  showDate = false
}: ListItemsProps) {
  return (
    <>
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          completeButtonText={completeButtonText}
          uncompleteButtonText={uncompleteButtonText}
          onToggle={!onToggle ? undefined : onToggle}
          onNotesChange={!onNotesChange ? undefined : (id, notes) => onNotesChange(id, notes)}
          showDate={showDate}
        />
      ))}
    </>
  );
}