import useSWRInfinite from "swr/infinite";
import { getChatInteractions } from "../actions/getChatInteractions";
import type { Interaction } from "../types/types";

const PAGE_SIZE = 20;

export function useChatInteractions(
  token: string,
  farmId: number,
  followedPlayerId: number,
) {
  // The cursor is the last entry's createdAt plus its id: the API breaks
  // createdAt ties on the id, so entries sharing the cut-off time are not
  // skipped by the next page
  const getKey = (_: number, previousPageData: Interaction[]) => {
    if (previousPageData && previousPageData.length === 0) return null;
    const last = previousPageData?.[previousPageData.length - 1];
    return [
      "chat-interactions",
      farmId,
      followedPlayerId,
      last?.createdAt ?? 0,
      last?.id ?? "",
    ] as const;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    ([, , , cursor, cursorId]: NonNullable<ReturnType<typeof getKey>>) =>
      getChatInteractions({
        token,
        farmId,
        followedPlayerId,
        cursor,
        cursorId: cursorId || undefined,
      }),
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
