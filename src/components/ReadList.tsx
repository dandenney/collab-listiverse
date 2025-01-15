import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function ReadList() {
  const handleSaveItem = (item: BaseItem) => {
    console.log("Saved read item:", item);
  };

  return (
    <BaseList
      title="Reading List"
      urlPlaceholder="Enter article URL..."
      completeButtonText="Mark Read"
      uncompleteButtonText="Mark Unread"
      onSaveItem={handleSaveItem}
      listType="read"
      showDate={false}
    />
  );
}