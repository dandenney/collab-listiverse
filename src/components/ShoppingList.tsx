import { BaseList } from "./BaseList";

export function ShoppingList() {
  return (
    <BaseList
      title="Shopping List"
      urlPlaceholder="Enter product URL..."
      completeButtonText="Mark Complete"
      uncompleteButtonText="Mark Incomplete"
      listType="shopping"
      showDate={false}
    />
  );
}