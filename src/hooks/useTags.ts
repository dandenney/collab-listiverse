import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag, ListType } from "@/types/list";
import { useToast } from "./use-toast";

export function useTags(listType?: ListType) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ['tags', listType],
    queryFn: async () => {
      const query = supabase
        .from('tags')
        .select('*')
        .order('name');

      if (listType) {
        query.eq('type', listType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Tag[];
    }
  });

  const createTagMutation = useMutation({
    mutationFn: async ({ name, color }: { name: string, color: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name,
          color,
          type: listType || 'read', // Default to 'read' if no type provided
          user_id: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', listType] });
      toast({
        title: "Tag Created",
        description: "Your new tag has been created successfully"
      });
    },
    onError: (error) => {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    createTag: createTagMutation.mutate
  };
}