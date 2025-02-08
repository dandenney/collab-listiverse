
import { BaseItem, ListType } from "@/types/list";

export function transformAndSortItems(items: any[], listType: ListType): BaseItem[] {
  const transformedItems = items.map((item: any) => ({
    ...item,
    tags: item.item_tags?.map((it: any) => it.tags.name) || []
  }));

  if (listType === 'local') {
    return transformedItems.sort((a, b) => {
      // First, handle date-based sorting for items with dates
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (a.date) return -1;
      if (b.date) return 1;

      // For items without dates, sort by tags (items with tags come first)
      if (a.tags.length && !b.tags.length) return -1;
      if (!a.tags.length && b.tags.length) return 1;
      
      // If both items have tags, sort alphabetically by the first tag
      if (a.tags.length && b.tags.length) {
        const firstTagA = a.tags[0].toLowerCase();
        const firstTagB = b.tags[0].toLowerCase();
        if (firstTagA !== firstTagB) {
          return firstTagA.localeCompare(firstTagB);
        }
      }

      // Finally, sort by creation date if everything else is equal
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return transformedItems;
}
