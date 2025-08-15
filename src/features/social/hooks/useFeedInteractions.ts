import useSWRInfinite from "swr/infinite";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";
import { FeedFilter } from "../Feed";
import { useEffect, useState } from "react";

const PAGE_SIZE = 50;

export function useFeedInteractions(
  token: string,
  farmId: number,
  filter: FeedFilter,
  sessionId: number,
  isGlobal: boolean,
) {
  const [followingList, setFollowingList] = useState<number[]>([]);

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

  const isLoadingInitialData = !data && isValidating;

  useEffect(() => {
    if (!isLoadingInitialData && !followingList.length) {
      // Only take following from the first page since it should be consistent across all pages
      setFollowingList(data?.[0]?.following ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, isLoadingInitialData, followingList]);

  const feed = data ? data.flatMap((page) => page.feed).filter(Boolean) : [];

  return {
    feed,
    following: followingList,
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
