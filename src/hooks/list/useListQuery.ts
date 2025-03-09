
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { transformAndSortItems } from "@/utils/listItemUtils";

export function useListQuery(listType: ListType, showArchived: boolean) {
  return useQuery({
    queryKey: ['items', listType, showArchived],
    queryFn: async () => {
      console.log(`Fetching ${listType} items with archived=${showArchived}`);
      
      // Query all items of the given type and archived status - no user_id filter
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

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
        throw itemsError;
      }
      
      console.log(`Fetched ${items.length} ${listType} items`);
      
      // Add extra logging to inspect items data
      items.forEach(item => {
        console.log(`Item ${item.id}: completed=${item.completed}, user_id=${item.user_id}`);
      });
      
      return transformAndSortItems(items, listType);
    },
    // Disable automatic refetching to prevent our optimistic updates from being overridden
    refetchOnWindowFocus: false,
    staleTime: 10000 // Increase stale time to reduce unnecessary refetches
  });
}
