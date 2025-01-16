import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface ItemNotesProps {
  notes: string;
  isEditing: boolean;
  editingNotes: string;
  onNotesChange: (value: string) => void;
}

export function ItemNotes({
  notes,
  isEditing,
  editingNotes,
  onNotesChange
}: ItemNotesProps) {
  if (!notes && !isEditing) return null;

  return (
    <>
      {isEditing ? (
        <Textarea
          value={editingNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add your notes here..."
          className="min-h-[100px]"
        />
      ) : (
        <div className="mt-2 p-3 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap">{notes}</p>
        </div>
      )}
    </>
  );
}