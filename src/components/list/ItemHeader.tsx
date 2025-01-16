import React from 'react';
import { Input } from "@/components/ui/input";

interface ItemHeaderProps {
  title: string;
  url: string | null;
  completed: boolean;
  date?: string;
  isEditing: boolean;
  editingTitle: string;
  showDate?: boolean;
  onTitleChange: (value: string) => void;
}

export function ItemHeader({
  title,
  url,
  completed,
  date,
  isEditing,
  editingTitle,
  showDate = false,
  onTitleChange
}: ItemHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return localDate.toLocaleDateString();
  };

  return (
    <div className="flex-1">
      {isEditing ? (
        <Input
          value={editingTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-medium"
        />
      ) : (
        <>
          {url ? (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 hover:underline ${
                completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {title}
            </a>
          ) : (
            <span className={completed ? "line-through text-muted-foreground" : ""}>
              {title}
            </span>
          )}
          {showDate && date && (
            <div className="text-sm font-medium text-foreground/90 mt-1">
              {formatDate(date)}
            </div>
          )}
        </>
      )}
    </div>
  );
}