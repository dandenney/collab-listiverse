import { ListType } from "@/types/list";
import { useListQuery } from "./list/useListQuery";
import { useListMutations } from "./list/useListMutations";

export function useListItems(listType: ListType, showArchived: boolean) {
  const query = useListQuery(listType, showArchived);
  const mutations = useListMutations(listType);

  return {
    query,
    ...mutations
  };
}