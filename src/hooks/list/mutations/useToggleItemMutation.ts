
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";
import { toast } from "sonner";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion to ${completed}:`, { id });
      
      // Update the item without expecting it to return data (since it might be created by another user)
      const { error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id);

      if (error) {
        console.error('Toggle error:', error);
        toast.error("Failed to update item status");
        throw error;
      }
      
      console.log('Toggle successful for item:', id);
      return { id, completed }; // Return the data we know about the item
    },
    onSuccess: (data) => {
      console.log('Toggle mutation succeeded:', data);
      
      // We're not immediately invalidating the query here anymore
      // Instead, we'll let the component handle when to clear its optimistic state
      
      // Update the cache optimistically to match our local state
      queryClient.setQueryData(
        ['items', listType],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          // Update the cached item with our new completed state
          return oldData.map((item: any) => 
            item.id === data.id ? { ...item, completed: data.completed } : item
          );
        }
      );
      
      toast.success("Item status updated");
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
    }
  });
}
