import useSWRInfinite from "swr/infinite";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";
import { FeedFilter } from "../Feed";
import { useEffect, useRef } from "react";

const PAGE_SIZE = 50;

export function useFeedInteractions(
  token: string,
  farmId: number,
  filter: FeedFilter,
  sessionId: number,
  isGlobal: boolean,
) {
  const getKey = (
    _: number,
    previousPageData: { feed: Interaction[]; following: number[] },
  ) => {
    if (previousPageData && previousPageData.feed.length === 0) return null;

    const cursor =
      previousPageData?.feed[previousPageData.feed.length - 1]?.createdAt ?? 0;
    return `feed-interactions-${farmId}-${isGlobal}-${filter}-${sessionId}-${cursor}`;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const cursor = key.split("-")[6];

      return getFeedInteractions({
        token,
        farmId,
        filter,
        isGlobal,
        cursor: Number(cursor),
      });
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      persistSize: false,
    },
  );

  const followingRef = useRef<number[] | null>([]);
  const lastSessionIdRef = useRef<number>(sessionId);

  // Reset the following list when the sessionId changes
  if (lastSessionIdRef.current !== sessionId) {
    followingRef.current = null;
    lastSessionIdRef.current = sessionId;
  }

  // Whatever SWR returned for page 0 this render
  const firstFollowing = data?.[0]?.following;

  // Capture once per session (even if it's an empty array)
  useEffect(() => {
    if (!followingRef.current && firstFollowing !== undefined) {
      followingRef.current = firstFollowing;
    }
  }, [firstFollowing, sessionId]);

  const following = followingRef.current ?? firstFollowing ?? [];

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
