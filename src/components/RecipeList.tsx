import { BaseList } from "./BaseList";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon } from "lucide-react";
import { ManageTagsDialog } from "./tags/ManageTagsDialog";

export function RecipeList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ManageTagsDialog listType="recipe">
          <Button variant="outline" className="flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Manage Tags
          </Button>
        </ManageTagsDialog>
      </div>

      <BaseList
        title="Recipe List"
        urlPlaceholder="Enter recipe URL..."
        completeButtonText="Made it!"
        uncompleteButtonText="Make again"
        listType="recipe"
      />
    </div>
  );
}