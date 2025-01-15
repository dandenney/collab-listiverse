import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function ReadList() {
  const handleSaveItem = (item: BaseItem) => {
    // Add any read-specific save logic here
    console.log("Saved read item:", item);
  };

  return (
    <BaseList
      title="Reading List"
      urlPlaceholder="Enter article URL..."
      completeButtonText="Mark Read"
      uncompleteButtonText="Mark Unread"
      onSaveItem={handleSaveItem}
    />
  );
}