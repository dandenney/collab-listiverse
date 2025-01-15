import { BaseList } from "./BaseList";

export function ReadList() {
  return (
    <BaseList
      title="Reading List"
      urlPlaceholder="Enter article URL..."
      completeButtonText="Mark Read"
      uncompleteButtonText="Mark Unread"
      listType="read"
      showDate={false}
    />
  );
}