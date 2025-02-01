import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, ListType } from "@/types/list";

export function useTags(listType?: ListType) {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ['tags', listType],
    queryFn: async () => {
      console.log('Fetching tags for list type:', listType);
      const query = supabase
        .from('tags')
        .select('*')
        .order('name');

      if (listType) {
        query.eq('type', listType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
      
      console.log('Retrieved tags:', data);
      return data as Tag[];
    }
  });

  const createTagMutation = useMutation({
    mutationFn: async ({ name, color }: { name: string, color: string }) => {
      console.log('Creating tag:', { name, color, type: listType });
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      if (!listType) {
        throw new Error('List type is required to create a tag');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name,
          color,
          type: listType,
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating tag:', error);
        throw error;
      }

      console.log('Created tag:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', listType] });
    },
    onError: (error) => {
      console.error('Error creating tag:', error);
    }
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    createTag: createTagMutation.mutate
  };
}