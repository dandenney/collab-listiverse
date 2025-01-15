import { useState, useEffect } from "react";
import { Archive } from "lucide-react";
import { BaseItem, PendingItem, Tag } from "@/types/list";
import { AddItemForm } from "./list/AddItemForm";
import { ItemEditor } from "./list/ItemEditor";
import { ListItem } from "./list/ListItem";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BaseListProps {
  title: string;
  urlPlaceholder: string;
  completeButtonText: string;
  uncompleteButtonText: string;
  onSaveItem: (item: BaseItem) => void;
  listType: 'grocery' | 'shopping' | 'watch' | 'read' | 'local' | 'recipe';
  availableTags?: Tag[];
  showDate?: boolean;
}

export function BaseList({
  title,
  urlPlaceholder,
  completeButtonText,
  uncompleteButtonText,
  listType,
  availableTags = [],
  showDate = false
}: BaseListProps) {
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items', listType, showArchived],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('type', listType)
        .eq('archived', showArchived)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (newItem: BaseItem) => {
      const { data, error } = await supabase
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', listType] });
      toast({
        title: "Item Added",
        description: "Your item has been added to the list"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle item mutation
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

  // Update notes mutation
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

  // Archive completed items mutation
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

  const handlePendingItem = (item: PendingItem) => {
    setPendingItem(item);
  };

  const savePendingItem = () => {
    if (!pendingItem) return;

    addItemMutation.mutate({
      id: crypto.randomUUID(),
      url: pendingItem.url,
      title: pendingItem.title,
      description: pendingItem.description,
      completed: false,
      tags: pendingItem.tags,
      date: showDate ? pendingItem.date : undefined,
      notes: pendingItem.notes || ""
    });
    
    setPendingItem(null);
  };

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      toggleItemMutation.mutate({ id, completed: !item.completed });
    }
  };

  const updateItemNotes = (id: string, notes: string) => {
    updateNotesMutation.mutate({ id, notes });
  };

  const archiveCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) {
      toast({
        title: "No items to archive",
        description: "Complete some items first!",
        variant: "destructive"
      });
      return;
    }
    
    archiveCompletedMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          {!showArchived && (
            <Button
              variant="outline"
              onClick={archiveCompleted}
              className="flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive Completed
            </Button>
          )}
        </div>
      </div>

      {!showArchived && (
        <>
          <AddItemForm 
            urlPlaceholder={urlPlaceholder}
            onPendingItem={handlePendingItem}
          />

          {pendingItem && (
            <ItemEditor
              pendingItem={pendingItem}
              onPendingItemChange={setPendingItem}
              onSave={savePendingItem}
              availableTags={availableTags}
              showDate={showDate}
            />
          )}
        </>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            completeButtonText={completeButtonText}
            uncompleteButtonText={uncompleteButtonText}
            onToggle={!showArchived ? toggleItem : undefined}
            onNotesChange={!showArchived ? updateItemNotes : undefined}
            showDate={showDate}
          />
        ))}
      </div>
    </div>
  );
}