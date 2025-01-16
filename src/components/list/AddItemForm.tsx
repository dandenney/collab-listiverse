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

  const getPlaceholderImage = () => {
    const placeholders = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsLoading(true);
    try {
      if (isUrlRequired) {
        new URL(newUrl);
        const response = await mql(newUrl);
        const metadata = (response as unknown as { data: Metadata }).data;
        
        const imageUrl = metadata.image?.url;
        const finalImageUrl = imageUrl || getPlaceholderImage();
        
        onPendingItem({
          url: newUrl.trim(),
          title: metadata.title || new URL(newUrl).hostname,
          description: metadata.description || "",
          image: finalImageUrl,
          tags: []
        });
      } else {
        onPendingItem({
          url: "",
          title: newUrl.trim(),
          description: "",
          image: getPlaceholderImage(),
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