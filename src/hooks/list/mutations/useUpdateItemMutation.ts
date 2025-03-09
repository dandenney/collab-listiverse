
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { toast } from "sonner";

export function useUpdateItemMutation(listType: ListType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: BaseItem) => {
      console.log('=== Update Mutation Debug Log ===');
      console.log('Item to update:', item);

      // Update without expecting data back
      const { error } = await supabase
        .from('list_items')
        .update({
          title: item.title,
          description: item.description,
          notes: item.notes,
          image: item.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) {
        console.error('Update error:', error);
        toast.error("Failed to update item");
        throw error;
      }

      console.log('Item update successful for id:', item.id);
      
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

      return item; // Return the item we were updating
    },
    onSuccess: (result) => {
      console.log('Update successful:', result);
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });
}
