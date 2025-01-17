import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

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
    <Card className="flex flex-col h-full">
      <div className="p-4 flex-grow">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={onToggle}
            className="mt-1"
          />
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
              className={`flex-1 break-words ${completed ? "line-through text-muted-foreground" : ""}`}
            >
              {title}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDoubleClick}
          className="w-full justify-center"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </Card>
  );
}