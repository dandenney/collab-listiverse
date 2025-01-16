import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ItemDescriptionProps {
  description: string;
  completed: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  editingDescription: string;
  onDescriptionChange: (value: string) => void;
  onToggleExpand: () => void;
}

export function ItemDescription({
  description,
  completed,
  isEditing,
  isExpanded,
  editingDescription,
  onDescriptionChange,
  onToggleExpand
}: ItemDescriptionProps) {
  if (!description && !isEditing) return null;

  return (
    <div>
      {isEditing ? (
        <Textarea
          value={editingDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a description..."
          className="min-h-[60px]"
        />
      ) : (
        <>
          <p className={`text-sm text-muted-foreground ${
            completed ? "line-through" : ""
          } ${!isExpanded ? "line-clamp-4" : ""}`}>
            {description}
          </p>
          {description.split('\n').length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="mt-1 h-6 px-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}