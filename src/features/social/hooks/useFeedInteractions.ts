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
    _: number,
    previousPageData: { feed: Interaction[]; following: number[] },
  ) => {
    if (previousPageData && previousPageData.feed.length === 0) return null;

    const cursor =
      previousPageData?.feed[previousPageData.feed.length - 1]?.createdAt ?? 0;
    return `feed-interactions-${farmId}-${isGlobal}-${filter}-${cursor}`;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const cursor = key.split("-")[5];

      return getFeedInteractions({
        token,
        farmId,
        filter,
        isGlobal,
        cursor: Number(cursor),
      });
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
