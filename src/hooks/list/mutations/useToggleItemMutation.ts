
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
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast.success("Item status updated");
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
    }
  });
}
