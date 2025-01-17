import { BaseItem } from "@/types/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ItemHeader } from "./ItemHeader";
import { ItemDescription } from "./ItemDescription";
import { ItemNotes } from "./ItemNotes";
import { ItemTags } from "./ItemTags";

interface ListItemProps {
  item: BaseItem;
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
  showDate?: boolean;
}

export function ListItem({
  item,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onNotesChange,
  showDate = false
}: ListItemProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        
        <ItemHeader item={item} showDate={showDate} />
        
        <ItemDescription item={item} />
        
        {item.tags && item.tags.length > 0 && (
          <ItemTags tags={item.tags} />
        )}

        {onNotesChange && (
          <ItemNotes
            notes={item.notes || ""}
            onChange={(notes) => onNotesChange(item.id, notes)}
          />
        )}

        <div className="flex justify-end gap-2">
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(item.id)}
              className={item.completed ? "text-primary" : "text-muted-foreground"}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}