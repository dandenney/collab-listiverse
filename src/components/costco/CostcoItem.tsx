
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
  console.log(`Rendering CostcoItem: ${id}, title: "${title}", completed: ${completed}, isEditing: ${isEditing}`);
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={completed}
            onCheckedChange={() => {
              console.log(`Checkbox clicked for item: ${id} Current completed state: ${completed}`);
              onToggle();
            }}
          />
          {isEditing ? (
            <Input
              value={editingTitle}
              onChange={(e) => {
                console.log(`Editing title for item: ${id}, new value: "${e.target.value}"`);
                onEditingTitleChange(e.target.value);
              }}
              onBlur={() => {
                console.log(`Input blur event for item: ${id}`);
                onBlur();
              }}
              onKeyDown={(e) => {
                console.log(`Key pressed for item: ${id}, key: ${e.key}`);
                onKeyDown(e);
              }}
              autoFocus
              className="flex-1"
            />
          ) : (
            <span
              className={`flex-1 ${completed ? "line-through text-muted-foreground" : ""}`}
              onDoubleClick={() => {
                console.log(`Double click on item: ${id}`);
                onDoubleClick();
              }}
            >
              {title}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
