import { BaseItem, ListType } from "@/types/list";
import { ListItem } from "./ListItem";

interface ListItemsProps {
  items: BaseItem[];
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle?: (id: string) => void;
  showDate?: boolean;
  showArchived?: boolean;
  updateItem?: (id: string, updates: Partial<BaseItem>) => void;
  listType: ListType;
}

export function ListItems({
  items,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  showDate = false,
  showArchived = false,
  updateItem,
  listType
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
          onUpdate={!showArchived ? updateItem : undefined}
          showDate={showDate}
          listType={listType}
        />
      ))}
    </>
  );
}