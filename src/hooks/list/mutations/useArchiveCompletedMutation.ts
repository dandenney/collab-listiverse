
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListType } from "@/types/list";

export function useArchiveCompletedMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Archiving completed items for type:', listType);
      const { error } = await supabase
        .from('list_items')
        .update({ archived: true })
        .eq('type', listType)
        .eq('completed', true);

      if (error) {
        console.error('Archive error:', error);
        throw error;
      }
      
      console.log('Archive operation successful');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    },
    onError: (error) => {
      console.error('Archive operation failed:', error);
    }
  });
}
