import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import mql from '@microlink/mql';
import { PendingItem, Metadata } from "@/types/list";

interface AddItemFormProps {
  urlPlaceholder: string;
  onPendingItem: (item: PendingItem) => void;
  isUrlRequired?: boolean;
}

export function AddItemForm({ urlPlaceholder, onPendingItem, isUrlRequired = true }: AddItemFormProps) {
  const [newUrl, setNewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsLoading(true);
    try {
      if (isUrlRequired) {
        new URL(newUrl);
        const response = await mql(newUrl);
        const metadata = (response as unknown as { data: Metadata }).data;
        
        onPendingItem({
          url: newUrl.trim(),
          title: metadata.title || new URL(newUrl).hostname,
          description: metadata.description,
          tags: []
        });
      } else {
        // For non-URL items (like grocery items), use the input as the title
        onPendingItem({
          url: "",
          title: newUrl.trim(),
          description: "",
          tags: []
        });
      }
      
      setNewUrl("");
    } catch (error) {
      toast({
        title: isUrlRequired ? "Error fetching metadata" : "Error adding item",
        description: isUrlRequired ? "Please enter a valid URL" : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder={urlPlaceholder}
        type={isUrlRequired ? "url" : "text"}
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" className="flex items-center gap-2" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}