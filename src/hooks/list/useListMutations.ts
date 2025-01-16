import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { useToast } from "@/hooks/use-toast";

export function useListMutations(listType: ListType) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: async (newItem: BaseItem) => {
      const { data: item, error: itemError } = await supabase
        .from('list_items')
        .insert([{
          type: listType,
          url: newItem.url,
          title: newItem.title,
          description: newItem.description,
          completed: false,
          notes: newItem.notes,
          date: newItem.date,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (itemError) throw itemError;

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: "Item Added",
        description: "Your item has been added to the list"
      });
    }
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('list_items')
        .update({ completed })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Item not found');
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: data.completed ? "Item Completed" : "Item Uncompleted",
        description: data.title
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ 
      id, 
      title,
      description,
      notes,
      tags 
    }: { 
      id: string;
      title: string;
      description?: string;
      notes?: string;
      tags?: string[];
    }) => {
      const { data, error: itemError } = await supabase
        .from('list_items')
        .update({ 
          title,
          description,
          notes
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (itemError) throw itemError;
      if (!data) throw new Error('Item not found');

      if (tags !== undefined) {
        const { error: deleteError } = await supabase
          .from('item_tags')
          .delete()
          .eq('item_id', id);

        if (deleteError) throw deleteError;

        if (tags.length > 0) {
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', tags);

          if (tagError) throw tagError;

          if (tagData && tagData.length > 0) {
            const itemTags = tagData.map(tag => ({
              item_id: id,
              tag_id: tag.id
            }));

            const { error: createError } = await supabase
              .from('item_tags')
              .insert(itemTags);

            if (createError) throw createError;
          }
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: "Item Updated",
        description: "Your changes have been saved"
      });
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
      toast({
        title: "Items Archived",
        description: "Completed items have been archived"
      });
    }
  });

  return {
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  };
}