import useSWRInfinite from "swr/infinite";
import { getFeedInteractions } from "../actions/getFeedInteractions";
import { Interaction } from "../types/types";

const PAGE_SIZE = 100;

export function useFeedInteractions(
  token: string,
  farmId: number,
  isGlobal: boolean,
) {
  const getKey = (_: number, previousPageData: Interaction[]) => {
    if (previousPageData && previousPageData.length === 0) return null;
    const cursor =
      previousPageData?.[previousPageData.length - 1]?.createdAt ?? 0;
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

  const interactions = data ? data.flat().filter(Boolean) : [];

  return {
    interactions,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore: data && data[data.length - 1]?.length === PAGE_SIZE,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}
