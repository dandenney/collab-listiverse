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
}

export function AddItemForm({ urlPlaceholder, onPendingItem }: AddItemFormProps) {
  const [newUrl, setNewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsLoading(true);
    try {
      new URL(newUrl);
      const response = await mql(newUrl);
      const metadata = (response as unknown as { data: Metadata }).data;
      
      onPendingItem({
        url: newUrl.trim(),
        title: metadata.title || new URL(newUrl).hostname,
        description: metadata.description,
        tags: []
      });
      
      setNewUrl("");
    } catch (error) {
      toast({
        title: "Error fetching metadata",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={fetchMetadata} className="flex gap-2 mb-6">
      <Input
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder={urlPlaceholder}
        type="url"
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" className="flex items-center gap-2" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isLoading ? "Fetching..." : "Fetch"}
      </Button>
    </form>
  );
}