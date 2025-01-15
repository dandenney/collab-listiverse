import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function ShoppingList() {
  const handleSaveItem = (item: BaseItem) => {
    console.log("Saved shopping item:", item);
  };

  return (
    <BaseList
      title="Shopping List"
      urlPlaceholder="Enter product URL..."
      completeButtonText="Mark Complete"
      uncompleteButtonText="Mark Incomplete"
      onSaveItem={handleSaveItem}
      listType="shopping"
      showDate={false}
    />
  );
}