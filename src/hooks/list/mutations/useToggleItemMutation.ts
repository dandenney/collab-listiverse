
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";
import { toast } from "sonner";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion to ${completed}:`, { id });
      
      // Update the item with the new completed state
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
      
      // Check if we got data back and use it, otherwise fall back to our local state
      const updatedItem = data && data.length > 0 ? data[0] : { id, completed };
      console.log('Toggle successful, using data:', updatedItem);
      return updatedItem;
    },
    onSuccess: (data) => {
      console.log('Toggle mutation succeeded with data:', data);
      
      // Update the cached item with our response data
      queryClient.setQueryData(
        ['items', listType],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          console.log('Updating cache with data:', data);
          console.log('Old cache data:', oldData);
          
          // Update the cached item with our response data
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
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    }
  });
}
