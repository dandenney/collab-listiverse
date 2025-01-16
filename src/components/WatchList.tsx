import { BaseList } from "./BaseList";

export function WatchList() {
  return (
    <BaseList
      title="Watch List"
      urlPlaceholder="Enter video URL..."
      completeButtonText="Mark Watched"
      uncompleteButtonText="Mark Unwatched"
      listType="watch"
      showDate={false}
      isUrlRequired={true}
    />
  );
}