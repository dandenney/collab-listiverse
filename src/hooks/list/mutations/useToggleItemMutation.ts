
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";
import { toast } from "sonner";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion to ${completed}:`, { id });
      
      // First perform the update
      const { data, error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Toggle error:', error);
        toast.error("Failed to update item status");
        throw error;
      }
      
      console.log('Toggle successful, updated item:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Toggle mutation succeeded:', data);
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
    }
  });
}
