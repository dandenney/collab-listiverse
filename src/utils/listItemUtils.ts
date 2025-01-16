import { BaseItem, ListType } from "@/types/list";

export function transformAndSortItems(items: any[], listType: ListType): BaseItem[] {
  const transformedItems = items.map((item: any) => ({
    ...item,
    tags: item.item_tags?.map((it: any) => it.tags.name) || []
  }));

  if (listType === 'local') {
    return transformedItems.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (a.date) return -1;
      if (b.date) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return transformedItems;
}