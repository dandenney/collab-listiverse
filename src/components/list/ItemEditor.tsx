import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PendingItem, ListType } from "@/types/list";
import { EditorForm } from "./editor/EditorForm";
import { EditorTags } from "./editor/EditorTags";

interface ItemEditorProps {
  pendingItem: PendingItem;
  onPendingItemChange: (item: PendingItem) => void;
  onSave: () => void;
  showDate?: boolean;
  listType: ListType;
}

export function ItemEditor({ 
  pendingItem, 
  onPendingItemChange, 
  onSave,
  showDate = false,
  listType
}: ItemEditorProps) {
  return (
    <Card className="p-4 mb-6">
      <h2 className="font-semibold mb-4">Edit Item Details</h2>
      <div className="space-y-4">
        <EditorForm
          pendingItem={pendingItem}
          onPendingItemChange={onPendingItemChange}
          showDate={showDate}
        />
        
        <EditorTags
          pendingItem={pendingItem}
          onPendingItemChange={onPendingItemChange}
          listType={listType}
        />

        <Button onClick={onSave} className="w-full">
          Save to List
        </Button>
      </div>
    </Card>
  );
}