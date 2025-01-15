import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Check, Tag as TagIcon } from "lucide-react";
import { BaseItem } from "@/types/list";
import { useToast } from "@/hooks/use-toast";

interface ListItemProps {
  item: BaseItem;
  completeButtonText: string;
  uncompleteButtonText: string;
  onToggle: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

export function ListItem({
  item,
  completeButtonText,
  uncompleteButtonText,
  onToggle,
  onNotesChange
}: ListItemProps) {
  const [editingNotes, setEditingNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const startEditing = () => {
    setEditingNotes(item.notes || "");
    setIsEditing(true);
  };

  const saveNotes = () => {
    onNotesChange(item.id, editingNotes);
    setIsEditing(false);
    toast({
      title: "Notes saved",
      description: "Your notes have been updated"
    });
  };

  return (
    <Card
      className={`p-4 ${item.completed ? "bg-muted" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 hover:underline ${
                item.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.title}
            </a>
            {item.date && (
              <div className="text-sm text-muted-foreground">
                {new Date(item.date).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditing}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onToggle(item.id);
              }}
            >
              {item.completed ? uncompleteButtonText : completeButtonText}
            </Button>
          </div>
        </div>
        {item.description && (
          <p className={`text-sm text-muted-foreground ${
            item.completed ? "line-through" : ""
          }`}>
            {item.description}
          </p>
        )}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[100px]"
            />
            <Button
              size="sm"
              onClick={saveNotes}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Notes
            </Button>
          </div>
        ) : item.notes && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {item.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10"
              >
                <TagIcon className="w-3 h-3" />
                <span className="text-sm">{tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}