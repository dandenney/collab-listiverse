
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";

export function useUpdateItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: BaseItem) => {
      console.log('=== Update Mutation Debug Log ===');
      console.log('Item to update:', item);

      // First, update the item's basic information
      // The key fix: changed .select() to select().maybeSingle() to handle potential missing rows
      const { data, error } = await supabase
        .from('list_items')
        .update({
          title: item.title,
          description: item.description,
          notes: item.notes,
          image: item.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Basic item update response:', data);

      // Changed: Don't check for empty data array, just return the first item if available
      // This matches how the GroceryList implementation handles the response
      const updatedItem = data && data.length > 0 ? data[0] : null;
      
      if (!updatedItem) {
        console.log('No data returned from update - this may be expected if no changes were made');
        // Instead of throwing error, return the original item
        return item;
      }

      // If tags are included in the update, handle them
      if (item.tags !== undefined) {
        console.log('Updating tags for item:', item.tags);
        
        // First, remove all existing tags for this item
        const { error: deleteError } = await supabase
          .from('item_tags')
          .delete()
          .eq('item_id', item.id);

        if (deleteError) {
          console.error('Error deleting existing tags:', deleteError);
          throw deleteError;
        }

        // Then, if there are new tags, add them
        if (item.tags && item.tags.length > 0) {
          console.log('Fetching tag IDs for names:', item.tags);
          
          const { data: tags, error: tagsError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', item.tags);

          if (tagsError) {
            console.error('Error fetching tags:', tagsError);
            throw tagsError;
          }

          console.log('Found tags:', tags);

          if (tags && tags.length > 0) {
            const itemTags = tags.map(tag => ({
              item_id: item.id,
              tag_id: tag.id
            }));

            console.log('Inserting new item_tags:', itemTags);

            const { error: insertError } = await supabase
              .from('item_tags')
              .insert(itemTags);

            if (insertError) {
              console.error('Error inserting new tags:', insertError);
              throw insertError;
            }
          }
        }
      }

      return updatedItem || item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });
}
