import useSWRInfinite from "swr/infinite";
import {
  FollowNetworkDetails,
  getFollowNetworkDetails,
} from "../actions/getFollowNetworkDetails";

export const useFollowNetwork = (
  token: string,
  loggedInFarmId: number,
  networkFarmId: number,
  networkType: "followers" | "following",
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: FollowNetworkDetails | null,
  ) => {
    if (pageIndex === 0)
      return `followNetworkDetails-${networkType}-${networkFarmId}-0`;

    if (!previousPageData?.data?.nextCursor) return null;

    return `followNetworkDetails-${networkType}-${networkFarmId}-${previousPageData.data.nextCursor}`;
  };

  const { data, size, error, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const parts = key.split("-");
      const cursor = parts[3];
      const nextCursor = cursor === "0" ? 0 : Number(cursor);

      return getFollowNetworkDetails({
        token,
        farmId: loggedInFarmId,
        networkFarmId,
        nextCursor,
        networkType,
      });
    },
  );

  const network = data?.flatMap((page) => page.data.network) ?? [];

  return {
    network,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore: data?.[data.length - 1]?.data.nextCursor !== null,
    loadMore: () => setSize(size + 1),
    error,
    mutate,
  };
};
