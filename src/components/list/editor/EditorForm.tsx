import { PendingItem } from "@/types/list";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditorFormProps {
  pendingItem: PendingItem;
  onPendingItemChange: (item: PendingItem) => void;
  showDate?: boolean;
}

export function EditorForm({ 
  pendingItem, 
  onPendingItemChange,
  showDate = false 
}: EditorFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <Input value={pendingItem.url} disabled />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input 
          value={pendingItem.title}
          onChange={(e) => onPendingItemChange({
            ...pendingItem,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea 
          value={pendingItem.description || ""}
          onChange={(e) => onPendingItemChange({
            ...pendingItem,
            description: e.target.value
          })}
        />
      </div>
      {showDate && (
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input 
            type="date"
            value={pendingItem.date || ""}
            onChange={(e) => onPendingItemChange({
              ...pendingItem,
              date: e.target.value
            })}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Textarea 
          value={pendingItem.notes || ""}
          onChange={(e) => onPendingItemChange({
            ...pendingItem,
            notes: e.target.value
          })}
          placeholder="Add your notes here..."
        />
      </div>
    </div>
  );
}