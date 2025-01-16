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
      toast({
        title: data.completed ? "Item Completed" : "Item Uncompleted",
        description: data.title
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: BaseItem) => {
      const { error } = await supabase
        .from('list_items')
        .update({ 
          title: item.title,
          description: item.description || "",
          notes: item.notes || "",
        })
        .eq('id', item.id);

      if (error) throw error;
      return item;
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(['items', listType], (oldData: BaseItem[] | undefined) => {
        if (!oldData) return [updatedItem];
        return oldData.map(item => 
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        );
      });
      
      toast({
        title: "Item Updated",
        description: "Your changes have been saved"
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive"
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
