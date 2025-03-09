
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddCostcoItemProps {
  newItem: string;
  onNewItemChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CostcoAddItem({
  newItem,
  onNewItemChange,
  onSubmit
}: AddCostcoItemProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-6">
      <Input
        value={newItem}
        onChange={(e) => onNewItemChange(e.target.value)}
        placeholder="Add an item..."
        className="flex-1"
      />
      <Button type="submit" size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
