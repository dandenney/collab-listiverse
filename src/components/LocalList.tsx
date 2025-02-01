import { useState } from "react";
import { BaseList } from "./BaseList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTags } from "@/hooks/useTags";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LocalList() {
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();
  const { tags = [] } = useTags("local");

  const addTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: tagName,
          color: `bg-${['red', 'yellow', 'blue', 'green', 'purple'][Math.floor(Math.random() * 5)]}-500`,
          type: 'local',
          user_id: userData.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });

  const removeTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });

  const addTag = () => {
    if (!newTag.trim()) return;
    
    addTagMutation.mutate(newTag.trim());
    setNewTag("");
  };

  const removeTag = (id: string) => {
    removeTagMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Manage Tags
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag..."
                  className="flex-1"
                />
                <Button onClick={addTag} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                      <span>{tag.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BaseList
        title="Local List"
        urlPlaceholder="Enter URL..."
        completeButtonText="Mark Complete"
        uncompleteButtonText="Mark Incomplete"
        listType="local"
        showDate={true}
      />
    </div>
  );
}