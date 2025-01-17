import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface GroceryItemProps {
  id: string;
  title: string;
  completed: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggle: () => void;
  onEditingTitleChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onDoubleClick: () => void;
}

export function GroceryItem({
  id,
  title,
  completed,
  isEditing,
  editingTitle,
  onToggle,
  onEditingTitleChange,
  onBlur,
  onKeyDown,
  onDoubleClick
}: GroceryItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={completed ? "text-primary" : "text-muted-foreground"}
          >
            <Check className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <Input
              value={editingTitle}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              autoFocus
              className="flex-1"
            />
          ) : (
            <span
              className={`flex-1 ${completed ? "line-through text-muted-foreground" : ""}`}
              onDoubleClick={onDoubleClick}
            >
              {title}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}