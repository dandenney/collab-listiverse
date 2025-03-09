
import { ListType } from "@/types/list";
import { useListQuery } from "./list/useListQuery";
import { useListMutations } from "./list/useListMutations";
import { useQueryClient } from "@tanstack/react-query";

export function useListItems(listType: ListType, showArchived: boolean) {
  const query = useListQuery(listType, showArchived);
  const mutations = useListMutations(listType);
  const queryClient = useQueryClient();

  return {
    query,
    mutations,
    queryClient,
    ...mutations
  };
}
