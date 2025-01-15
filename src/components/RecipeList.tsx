import { BaseList } from "./BaseList";

const recipeTags = [
  { id: "breakfast", name: "Breakfast", color: "bg-yellow-500" },
  { id: "lunch", name: "Lunch", color: "bg-orange-500" },
  { id: "dinner", name: "Dinner", color: "bg-red-500" },
  { id: "dessert", name: "Dessert", color: "bg-pink-500" },
  { id: "vegetarian", name: "Vegetarian", color: "bg-green-500" },
  { id: "vegan", name: "Vegan", color: "bg-emerald-500" },
  { id: "quick", name: "Quick & Easy", color: "bg-blue-500" },
  { id: "meal-prep", name: "Meal Prep", color: "bg-purple-500" }
];

export function RecipeList() {
  return (
    <BaseList
      title="Recipe List"
      urlPlaceholder="Enter recipe URL..."
      completeButtonText="Made it!"
      uncompleteButtonText="Make again"
      availableTags={recipeTags}
      onSaveItem={(item) => {
        console.log("Saved recipe:", item);
      }}
    />
  );
}