
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
      
      // Important: We're going to trust our local completed state
      // rather than what the database returned, which might be nothing
      console.log('Toggle successful for item:', id);
      return { id, completed }; // Return our local state
    },
    onSuccess: (data) => {
      console.log('Toggle mutation succeeded with local state:', data);
      
      // We're using a forced update to the cache with our local state
      // This is because we cannot trust the database to reflect our changes immediately
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
      
      toast.success("Item status updated");
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
    }
  });
}
