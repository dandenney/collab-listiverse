import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { useToast } from "@/hooks/use-toast";

export function useListMutations(listType: ListType) {
  const { toast } = useToast();
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
      if (listType !== 'grocery') {
        toast({
          title: "Item Added",
          description: "Your item has been added to the list"
        });
      }
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      if (listType !== 'grocery') {
        toast({
          title: "Failed to add item",
          description: "There was an error adding your item",
          variant: "destructive"
        });
      }
    }
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
      
      const { data, error: fetchError } = await supabase
        .from('list_items')
        .select()
        .eq('id', id)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      if (!data) throw new Error('Item not found');
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      if (listType !== 'grocery') {
        toast({
          title: data.completed ? "Item Completed" : "Item Uncompleted",
          description: data.title
        });
      }
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: BaseItem) => {
      console.log('=== Update Mutation Debug Log ===');
      console.log('Item to update:', item);

      const { data: updatedItem, error: updateError } = await supabase
        .from('list_items')
        .update({
          title: item.title,
          description: item.description,
          notes: item.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Update response:', updatedItem);
      return updatedItem;
    },
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      
      if (listType !== 'grocery') {
        toast({
          title: "Item Updated",
          description: "Your changes have been saved"
        });
      }
    },
    onError: (error) => {
      console.error('Update failed:', error);
      if (listType !== 'grocery') {
        toast({
          title: "Update Failed",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const archiveCompletedMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('list_items')
        .update({ archived: true })
        .eq('type', listType)
        .eq('completed', true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      if (listType !== 'grocery') {
        toast({
          title: "Items Archived",
          description: "Completed items have been archived"
        });
      }
    }
  });

  return {
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  };
}