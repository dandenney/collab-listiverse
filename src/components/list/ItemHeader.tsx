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
    console.log('dateString', dateString);

    try {
      // Extract just the date part before creating the Date object
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-');
      
      // Create date using components to avoid timezone conversion
      const date = new Date(+year, +month - 1, +day);
      
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
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
                className={`font-bold text-blue-600 text-pretty text-lg hover:underline ${
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
            <div className="font-medium text-foreground/90 mt-1">
              {formatDate(date)}
            </div>
          )}
        </>
      )}
    </div>
  );
}