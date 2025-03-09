
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";

export function useListMutations(listType: ListType) {
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: async (newItem: BaseItem) => {
      console.log('Starting mutation with item:', newItem);
      
      const itemToInsert = {
        type: listType,
        url: newItem.url,
        title: newItem.title,
        description: newItem.description,
        completed: false,
        notes: newItem.notes,
        date: newItem.date,
        image: newItem.image,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      
      console.log('Attempting to insert item:', itemToInsert);

      const { data: item, error: itemError } = await supabase
        .from('list_items')
        .insert([itemToInsert])
        .select()
        .single();

      if (itemError) {
        console.error('Error inserting item:', itemError);
        throw itemError;
      }

      console.log('Successfully inserted item:', item);

      if (newItem.tags && newItem.tags.length > 0) {
        const { data: tags, error: tagsError } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', newItem.tags);

        if (tagsError) throw tagsError;

        if (tags && tags.length > 0) {
          const itemTags = tags.map(tag => ({
            item_id: item.id,
            tag_id: tag.id
          }));

          const { error: itemTagsError } = await supabase
            .from('item_tags')
            .insert(itemTags);

          if (itemTagsError) throw itemTagsError;
        }
      }

      return item;
    },
    onSuccess: (data) => {
      console.log('Mutation completed successfully with data:', data);
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    }
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      console.log('Toggling item completion:', { id, completed });
      
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
    },
    onError: (error) => {
      console.error('Toggle operation failed:', error);
    }
  });

  const updateItemMutation = useMutation({
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

  const archiveCompletedMutation = useMutation({
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

  return {
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  };
}
