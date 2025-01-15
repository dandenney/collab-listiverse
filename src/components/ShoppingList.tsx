import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function ShoppingList() {
  const handleSaveItem = (item: BaseItem) => {
    // Add any shopping-specific save logic here
    console.log("Saved shopping item:", item);
  };

  return (
    <BaseList
      title="Shopping List"
      urlPlaceholder="Enter product URL..."
      completeButtonText="Mark Complete"
      uncompleteButtonText="Mark Incomplete"
      onSaveItem={handleSaveItem}
    />
  );
}