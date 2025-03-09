
import { AddCostcoItem } from "./AddCostcoItem";
import { useState } from "react";
import { toast } from "sonner";

interface CostcoAddItemProps {
  addItemMutation: any;
}

export function CostcoAddItem({ addItemMutation }: CostcoAddItemProps) {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: "",
      title: newItem.trim(),
      description: "",
      completed: false,
      tags: [],
      notes: ""
    }, {
      onSuccess: () => {
        console.log("Item added successfully");
        setNewItem("");
        toast.success("Item added successfully");
      },
      onError: (error: any) => {
        console.error("Error adding item:", error);
        toast.error("Failed to add item");
      }
    });
  };

  return (
    <AddCostcoItem
      newItem={newItem}
      onNewItemChange={setNewItem}
      onSubmit={handleSubmit}
    />
  );
}
