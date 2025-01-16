import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BaseItem, ListType } from "@/types/list";
import { useToast } from "@/hooks/use-toast";

export function useListItems(listType: ListType, showArchived: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
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

      // Transform the data to match our BaseItem interface
      const transformedItems = items.map((item: any) => ({
        ...item,
        tags: item.item_tags?.map((it: any) => it.tags.name) || []
      }));

      // For local list type, sort items with dates first
      if (listType === 'local') {
        return transformedItems.sort((a, b) => {
          // If both items have dates, compare them
          if (a.date && b.date) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }
          // If only one item has a date, prioritize it
          if (a.date) return -1;
          if (b.date) return 1;
          // If neither has a date, sort by created_at (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }

      return transformedItems;
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (newItem: BaseItem) => {
      // First insert the list item
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

      // If there are tags, get their IDs and create item_tags relationships
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
        .single();

      if (error) throw error;
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
      // First update the list item
      const { error: itemError } = await supabase
        .from('list_items')
        .update({ 
          title,
          description,
          notes
        })
        .eq('id', id);

      if (itemError) throw itemError;

      if (tags !== undefined) {
        // Delete existing tags
        const { error: deleteError } = await supabase
          .from('item_tags')
          .delete()
          .eq('item_id', id);

        if (deleteError) throw deleteError;

        if (tags.length > 0) {
          // Get tag IDs
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .select('id, name')
            .in('name', tags);

          if (tagError) throw tagError;

          if (tagData && tagData.length > 0) {
            // Create new item_tags relationships
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: "Item Updated",
        description: "Your changes have been saved"
      });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('list_items')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: "Notes Updated",
        description: "Your notes have been saved"
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
    query,
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    updateNotesMutation,
    archiveCompletedMutation
  };
}
