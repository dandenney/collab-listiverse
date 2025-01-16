import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ListActionsProps {
  showArchived: boolean;
  onToggleArchived: () => void;
  onArchiveCompleted: () => void;
  hasCompletedItems: boolean;
}

export function ListActions({
  showArchived,
  onToggleArchived,
  onArchiveCompleted,
  hasCompletedItems
}: ListActionsProps) {
  const { toast } = useToast();

  const handleArchiveCompleted = () => {
    if (!hasCompletedItems) {
      toast({
        title: "No items to archive",
        description: "Complete some items first!",
        variant: "destructive"
      });
      return;
    }
    onArchiveCompleted();
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="hover:bg-accent hover:text-accent-foreground"
        onClick={onToggleArchived}
      >
        {showArchived ? "Show Active" : "Show Archived"}
      </Button>
      {!showArchived && (
        <Button
          variant="outline"
          onClick={handleArchiveCompleted}
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Archive className="w-4 h-4" />
          Archive Completed
        </Button>
      )}
    </div>
  );
}