import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { socialKeys } from "lib/query/queryKeys";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";
import { FeedFilter } from "../Feed";
import { useEffect, useState, useCallback } from "react";
import isEqual from "lodash.isequal";

const PAGE_SIZE = 50;

type FeedPage = { feed: Interaction[]; following: number[] };

type MutateOptions = {
  revalidate?: boolean;
};

export function useFeedInteractions(
  token: string,
  farmId: number,
  filter: FeedFilter,
  isGlobal: boolean,
) {
  const queryClient = useQueryClient();
  const queryKey = socialKeys.feedInteractions(farmId, isGlobal, filter);

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
      getFeedInteractions({
        token,
        farmId,
        filter,
        isGlobal,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.feed || lastPage.feed.length < PAGE_SIZE) return undefined;
      return lastPage.feed[lastPage.feed.length - 1]?.createdAt;
    },
  });

  // Whatever React Query returned for page 0 this render
  const firstFollowing = data?.pages[0]?.following;

  const [following, setFollowing] = useState<number[]>([]);

  useEffect(() => {
    if (Array.isArray(firstFollowing)) {
      // We intentionally bridge React Query's `data.pages[0].following` into local state
      // with extra semantics (sticky last value + deep equality), which
      // isn't expressible as a pure derivation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFollowing((prev) => {
        if (
          prev.length === firstFollowing.length &&
          isEqual(prev, firstFollowing)
        ) {
          return prev;
        }

        return firstFollowing;
      });
    }
  }, [firstFollowing]);

  const feed = data?.pages.flatMap((page) => page.feed).filter(Boolean) ?? [];

  // SWR-compatible mutate function for optimistic updates
  const mutate = useCallback(
    async (
      updater?: (current: FeedPage[]) => FeedPage[],
      options?: MutateOptions,
    ) => {
      if (typeof updater === "function") {
        const currentData = data?.pages ?? [];
        const newPages = updater(currentData);
        queryClient.setQueryData<InfiniteData<FeedPage>>(queryKey, (old) =>
          old ? { ...old, pages: newPages } : undefined,
        );
      }

      // Revalidate if not explicitly disabled and no updater provided
      if (options?.revalidate !== false && !updater) {
        await refetch();
      }
    },
    [data?.pages, queryClient, queryKey, refetch],
  );

  return {
    feed,
    following,
    isLoadingInitialData: isFetching && !data,
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore: () => fetchNextPage(),
    mutate,
  };
}
