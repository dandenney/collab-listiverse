
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface CostcoItemProps {
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

export function CostcoItem({
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
}: CostcoItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={completed}
            onCheckedChange={onToggle}
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
