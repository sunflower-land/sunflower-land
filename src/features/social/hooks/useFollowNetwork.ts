import useSWRInfinite from "swr/infinite";
import {
  FollowNetworkDetails,
  FollowNetworkMember,
  getFollowNetworkDetails,
} from "../actions/getFollowNetworkDetails";

export const useFollowNetwork = (
  token: string,
  loggedInFarmId: number,
  networkFarmId: number,
  networkType: "followers" | "following",
) => {
  const getKey = (pageIndex: number, prev: FollowNetworkDetails | null) => {
    if (pageIndex === 0) {
      return [
        "followNetworkDetails",
        networkType,
        networkFarmId,
        loggedInFarmId,
        null,
      ];
    }

    const cursor = prev?.data?.nextCursor;
    if (!cursor) return null;

    return [
      "followNetworkDetails",
      networkType,
      networkFarmId,
      loggedInFarmId,
      cursor,
    ];
  };

  const { data, size, error, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    ([, networkType, networkFarmId, loggedInFarmId, cursor]: [
      string,
      "followers" | "following",
      number,
      number,
      FollowNetworkMember | null,
    ]) =>
      getFollowNetworkDetails({
        token,
        farmId: loggedInFarmId,
        networkFarmId,
        networkType,
        nextCursor: cursor ?? undefined, // already an object
      }),
  );

  const network = data?.flatMap((page) => page.data.network) ?? [];

  // Check if the last page has a nextCursor
  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage?.data?.nextCursor !== undefined;

  return {
    network,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore,
    loadMore: () => setSize(size + 1),
    error,
    mutate,
  };
};
