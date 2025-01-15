import { BaseList } from "./BaseList";

export function RecipeList() {
  return (
    <BaseList
      title="Recipe List"
      urlPlaceholder="Enter recipe URL..."
      completeButtonText="Made it!"
      uncompleteButtonText="Make again"
      listType="recipe"
    />
  );
}