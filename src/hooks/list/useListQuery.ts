import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { transformAndSortItems } from "@/utils/listItemUtils";

export function useListQuery(listType: ListType, showArchived: boolean) {
  return useQuery({
    queryKey: ['items', listType, showArchived],
    queryFn: async () => {
      const { data: items, error: itemsError } = await supabase
        .from('list_items')
        .select(`
          *,
          item_tags (
            tag_id,
            tags (
              name,
              color
            )
          )
        `)
        .eq('type', listType)
        .eq('archived', showArchived)
        .order(listType === 'local' ? 'date' : 'created_at', { ascending: listType === 'local' })
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      return transformAndSortItems(items, listType);
    }
  });
}