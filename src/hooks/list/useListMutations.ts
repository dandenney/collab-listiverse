
import { ListType } from "@/types/list";
import { useAddItemMutation } from "./mutations/useAddItemMutation";
import { useToggleItemMutation } from "./mutations/useToggleItemMutation";
import { useUpdateItemMutation } from "./mutations/useUpdateItemMutation";
import { useArchiveCompletedMutation } from "./mutations/useArchiveCompletedMutation";

export function useListMutations(listType: ListType) {
  const addItemMutation = useAddItemMutation(listType);
  const toggleItemMutation = useToggleItemMutation(listType);
  const updateItemMutation = useUpdateItemMutation(listType);
  const archiveCompletedMutation = useArchiveCompletedMutation(listType);

  return {
    addItemMutation,
    toggleItemMutation,
    updateItemMutation,
    archiveCompletedMutation
  };
}
