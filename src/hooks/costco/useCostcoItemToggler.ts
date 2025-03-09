
import { useState } from "react";
import { BaseItem } from "@/types/list";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCostcoItemToggler(
  items: BaseItem[], 
  toggleItemMutation: any
) {
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  const toggleItem = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) {
      console.error(`Item with ID ${id} not found when trying to toggle`);
      return;
    }

    const newCompletedState = !item.completed;
    console.log(`Toggling costco item: ${id} from ${item.completed} to ${newCompletedState}`);
    
    // Optimistically update UI immediately
    setPendingToggles(prev => ({ ...prev, [id]: newCompletedState }));
    
    try {
      // Execute the mutation and await its completion
      const result = await toggleItemMutation.mutateAsync({ 
        id, 
        completed: newCompletedState 
      });
      
      console.log(`Successfully toggled item: ${id} to ${newCompletedState}`, result);
      
      // Apply a persistent cache update to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['items', 'costco'] });
      
      // Remove the pending toggle after a short delay to ensure UI stability
      setTimeout(() => {
        setPendingToggles(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }, 1000);
      
    } catch (error) {
      console.error(`Exception when toggling item: ${id}`, error);
      // Revert optimistic update on error
      setPendingToggles(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      toast.error("Failed to update item status");
    }
  };

  const getEffectiveCompletedState = (item: BaseItem) => {
    // If the item is in pendingToggles, use that state, otherwise use the item's completed state
    return item.id in pendingToggles 
      ? pendingToggles[item.id] 
      : item.completed;
  };

  return {
    pendingToggles,
    toggleItem,
    getEffectiveCompletedState
  };
}
