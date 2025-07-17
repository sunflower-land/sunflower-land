import useSWRInfinite from "swr/infinite";
import { getChatMessages } from "../actions/getChatMessages";
import { Interaction } from "../types/types";

const PAGE_SIZE = 20;

export function useChatMessages(
  token: string,
  farmId: number,
  followedPlayerId: number,
) {
  const getKey = (_: number, previousPageData: Interaction[]) => {
    if (previousPageData && previousPageData.length === 0) return null;
    const cursor =
      previousPageData?.[previousPageData.length - 1]?.createdAt ?? 0;
    return `chat-${farmId}-${followedPlayerId}-${cursor}`;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const cursor = key.split("-")[3];
      return getChatMessages({
        token,
        farmId,
        followedPlayerId,
        cursor: Number(cursor),
      });
    },
    {
      revalidateFirstPage: false,
    },
  );

  const messages = data ? data.flat() : [];

  return {
    messages,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore: data && data[data.length - 1]?.length === PAGE_SIZE,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}
