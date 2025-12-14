import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { socialKeys } from "lib/query/queryKeys";
import { getChatInteractions } from "../actions/getChatInteractions";
import { Interaction } from "../types/types";
import { useCallback } from "react";

const PAGE_SIZE = 20;

type MutateOptions = {
  revalidate?: boolean;
  optimisticData?: (
    displayData: Interaction[][],
    currentData: Interaction[][],
  ) => Interaction[][];
};

export function useChatInteractions(
  token: string,
  farmId: number,
  followedPlayerId: number,
) {
  const queryClient = useQueryClient();
  const queryKey = socialKeys.chatInteractions(farmId, followedPlayerId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getChatInteractions({
        token,
        farmId,
        followedPlayerId,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.createdAt;
    },
  });

  const interactions = data?.pages.flat().filter(Boolean) ?? [];

  // SWR-compatible mutate function for optimistic updates
  const mutate = useCallback(
    async (
      updaterOrPromise?:
        | ((
            current: Interaction[][],
          ) => Interaction[][] | Promise<Interaction[][]>)
        | Promise<Interaction[][]>,
      options?: MutateOptions,
    ) => {
      const currentData = data?.pages ?? [];

      // Handle optimistic update
      if (options?.optimisticData) {
        const optimisticPages = options.optimisticData(
          currentData,
          currentData,
        );
        queryClient.setQueryData<InfiniteData<Interaction[]>>(
          queryKey,
          (old) => (old ? { ...old, pages: optimisticPages } : undefined),
        );
      }

      // Handle updater function or promise
      if (typeof updaterOrPromise === "function") {
        const newPages = await updaterOrPromise(currentData);
        queryClient.setQueryData<InfiniteData<Interaction[]>>(
          queryKey,
          (old) => (old ? { ...old, pages: newPages } : undefined),
        );
      } else if (updaterOrPromise instanceof Promise) {
        const newPages = await updaterOrPromise;
        queryClient.setQueryData<InfiniteData<Interaction[]>>(
          queryKey,
          (old) => (old ? { ...old, pages: newPages } : undefined),
        );
      }

      // Revalidate if not explicitly disabled
      if (options?.revalidate !== false && !updaterOrPromise) {
        await refetch();
      }
    },
    [data?.pages, queryClient, queryKey, refetch],
  );

  return {
    interactions,
    isLoadingInitialData: isFetching && !data,
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore: () => fetchNextPage(),
    mutate,
  };
}
