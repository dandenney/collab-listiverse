
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";
import { toast } from "sonner";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion to ${completed}:`, { id });
      
      // Update the item without expecting it to return data
      const { error, data } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id)
        .select();

      console.log('Toggle response from Supabase:', { error, data });
      
      if (error) {
        console.error('Toggle error:', error);
        toast.error("Failed to update item status");
        throw error;
      }
      
      // Return our local state to ensure consistent updates
      console.log('Toggle successful for item:', id);
      return { id, completed };
    },
    onSuccess: (data) => {
      console.log('Toggle mutation succeeded with local state:', data);
      
      // We're using a forced update to the cache with our local state
      queryClient.setQueryData(
        ['items', listType],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          console.log('Updating cache with data:', data);
          console.log('Old cache data:', oldData);
          
          // Update the cached item with our local state
          const newData = oldData.map((item: any) => 
            item.id === data.id ? { ...item, completed: data.completed } : item
          );
          
          console.log('New cache data:', newData);
          return newData;
        }
      );
      
      // Disable automatic invalidation to prevent overriding our optimistic updates
      // Instead, we'll apply our update manually
      toast.success("Item status updated");
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    }
  });
}
