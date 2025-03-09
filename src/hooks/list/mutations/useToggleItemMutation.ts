
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion to ${completed}:`, { id });
      
      // Simplify the toggle operation - just update the item
      const { data, error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Toggle error:', error);
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
