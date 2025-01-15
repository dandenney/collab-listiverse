import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function GroceryList() {
  const handleSaveItem = async (item: BaseItem) => {
    console.log("Saved grocery item:", item);
  };

  return (
    <BaseList
      title="Grocery List"
      urlPlaceholder="Enter item details..."
      completeButtonText="Mark Complete"
      uncompleteButtonText="Mark Incomplete"
      onSaveItem={handleSaveItem}
      listType="grocery"
      showDate={false}
    />
  );
}