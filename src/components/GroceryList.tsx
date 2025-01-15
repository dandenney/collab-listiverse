import { BaseList } from "./BaseList";

export function GroceryList() {
  return (
    <BaseList
      title="Grocery List"
      urlPlaceholder="Enter item name..."
      completeButtonText="Mark Complete"
      uncompleteButtonText="Mark Incomplete"
      listType="grocery"
      showDate={false}
      isUrlRequired={false}
    />
  );
}