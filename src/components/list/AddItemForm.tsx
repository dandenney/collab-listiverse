import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const getPlaceholderImage = () => {
    const placeholders = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ];
    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    console.log('Selected placeholder image:', placeholder);
    return placeholder;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsLoading(true);
    try {
      if (isUrlRequired) {
        console.log('Fetching metadata for URL:', newUrl);
        new URL(newUrl);
        const response = await mql(newUrl);
        const metadata = (response as unknown as { data: Metadata }).data;
        console.log('Received metadata:', metadata);
        
        const imageUrl = metadata.image?.url;
        console.log('Metadata image URL:', imageUrl);
        
        const finalImageUrl = imageUrl || getPlaceholderImage();
        console.log('Final image URL to be used:', finalImageUrl);
        
        const pendingItem = {
          url: newUrl.trim(),
          title: metadata.title || new URL(newUrl).hostname,
          description: metadata.description || "",
          image: finalImageUrl,
          tags: []
        };
        console.log('Creating pending item:', pendingItem);
        onPendingItem(pendingItem);
      } else {
        const placeholderImage = getPlaceholderImage();
        console.log('Using placeholder for non-URL item:', placeholderImage);
        onPendingItem({
          url: "",
          title: newUrl.trim(),
          description: "",
          image: placeholderImage,
          tags: []
        });
      }
      
      setNewUrl("");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
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