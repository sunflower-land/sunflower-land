import useSWRInfinite from "swr/infinite";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";

const PAGE_SIZE = 50;

export function useFeedInteractions(
  token: string,
  farmId: number,
  isGlobal: boolean,
) {
  //
  const getKey = (
    _: number,
    previousPageData: { feed: Interaction[]; following: number[] },
  ) => {
    if (previousPageData && previousPageData.feed.length === 0) return null;

    const cursor =
      previousPageData?.feed[previousPageData.feed.length - 1]?.createdAt ?? 0;
    return `feed-interactions-${farmId}-${isGlobal}-${cursor}`;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const cursor = key.split("-")[4];

      return getFeedInteractions({
        token,
        farmId,
        isGlobal,
        cursor: Number(cursor),
      });
    },
  );

  const feed = data ? data.flatMap((page) => page.feed).filter(Boolean) : [];
  // Only take following from the first page since it should be consistent across all pages
  const following = data && data.length > 0 ? data[0].following : [];

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
