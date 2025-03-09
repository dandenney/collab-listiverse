
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";

export function useToggleItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log(`Toggling item completion:`, { id, completed });
      
      const { error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id);

      if (error) {
        console.error('Toggle error:', error);
        throw error;
      }
      
      const { data, error: fetchError } = await supabase
        .from('list_items')
        .select()
        .eq('id', id)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Fetch error after toggle:', fetchError);
        throw fetchError;
      }
      
      if (!data) {
        console.error('Item not found after toggle');
        throw new Error('Item not found');
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
