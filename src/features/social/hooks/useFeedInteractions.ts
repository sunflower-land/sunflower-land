import useSWRInfinite from "swr/infinite";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";
import { FeedFilter } from "../Feed";
import { useEffect, useState } from "react";
import isEqual from "lodash.isequal";

const PAGE_SIZE = 50;

export function useFeedInteractions(
  token: string,
  farmId: number,
  filter: FeedFilter,
  isGlobal: boolean,
) {
  const getKey = (
    pageIndex: number,
    previousPageData: { feed: Interaction[]; following: number[] },
  ) => {
    if (pageIndex === 0) {
      return ["feed-interactions", farmId, isGlobal, filter, 0] as const;
    }

    if (!previousPageData) {
      return null;
    }
    if (previousPageData.feed.length === 0) {
      return null;
    }

    const cursor =
      previousPageData.feed[previousPageData.feed.length - 1]?.createdAt ?? 0;
    return ["feed-interactions", farmId, isGlobal, filter, cursor] as const;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (
      key: readonly [string, number, boolean, FeedFilter, number],
      _pageIndex: number,
      _prevData: { feed: Interaction[]; following: number[] },
    ) => {
      const [, farmIdKey, isGlobalKey, filterKey, cursor] = key as [
        string,
        number,
        boolean,
        FeedFilter,
        number,
      ];

      return getFeedInteractions({
        token,
        farmId: farmIdKey,
        filter: filterKey,
        isGlobal: isGlobalKey,
        cursor: Number(cursor),
      });
    },
    {
      // Avoid refetching page 0 when loading more pages
      revalidateFirstPage: false,
      // Avoid refetching on focus/reconnect; cursor-based pagination should stay stable
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 30_000,
    },
  );

  // Whatever SWR returned for page 0 this render
  const firstFollowing = data?.[0]?.following;

  const [following, setFollowing] = useState<number[]>([]);

  useEffect(() => {
    if (Array.isArray(firstFollowing)) {
      // We intentionally bridge SWR's `data[0].following` into local state
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

  const feed = data ? data.flatMap((page) => page.feed).filter(Boolean) : [];

  return {
    feed,
    following,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore:
      data &&
      data[data.length - 1]?.feed &&
      data[data.length - 1]?.feed.length === PAGE_SIZE,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}
