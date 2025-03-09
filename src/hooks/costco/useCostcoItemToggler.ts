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
      
      // Prevent any subsequent refetches from overriding our optimistic update
      // by applying a cache update that keeps our item's completed state
      const keepItemCompletedState = () => {
        console.log("Applying persistent cache update for item", id);
        queryClient.setQueryData(
          ['items', 'costco', false],
          (oldData: any) => {
            if (!oldData) return oldData;
            
            // Ensure our item keeps its completed state
            const updatedData = oldData.map((item: any) => 
              item.id === id ? { ...item, completed: newCompletedState } : item
            );
            
            console.log("Updated cache data:", updatedData);
            return updatedData;
          }
        );
      };
      
      // Apply our cache update immediately
      keepItemCompletedState();
      
      // We also need to keep the pendingToggles state to ensure UI consistency
      // Only clear it after the user navigates away or after a delay
      setTimeout(() => {
        setPendingToggles(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }, 2000); // Keep pending state for 2 seconds to ensure UI stability
      
    } catch (error) {
      console.error(`Exception when toggling item: ${id}`, error);
      // Revert optimistic update on error
      setPendingToggles(prev => ({ ...prev, [item.id]: item.completed }));
      toast.error("Failed to update item status");
    }
  };

  const getEffectiveCompletedState = (item: BaseItem) => {
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
