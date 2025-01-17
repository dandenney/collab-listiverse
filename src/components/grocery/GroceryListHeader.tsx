import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroceryListHeaderProps {
  showArchived: boolean;
  onToggleArchived: () => void;
  onArchiveCompleted: () => void;
}

export function GroceryListHeader({
  showArchived,
  onToggleArchived,
  onArchiveCompleted
}: GroceryListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">Grocery List</h1>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={onToggleArchived}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </Button>
        {!showArchived && (
          <Button
            variant="ghost"
            onClick={onArchiveCompleted}
            className="flex items-center gap-2"
          >
            <Archive className="w-4 h-4" />
            Archive Completed
          </Button>
        )}
      </div>
    </div>
  );
}