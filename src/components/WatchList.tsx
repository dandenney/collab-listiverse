import { BaseList } from "./BaseList";
import { BaseItem } from "@/types/list";

export function WatchList() {
  const handleSaveItem = (item: BaseItem) => {
    // Add any watch-specific save logic here
    console.log("Saved watch item:", item);
  };

  return (
    <BaseList
      title="Watch List"
      urlPlaceholder="Enter video URL..."
      completeButtonText="Mark Watched"
      uncompleteButtonText="Mark Unwatched"
      onSaveItem={handleSaveItem}
    />
  );
}