import useSWRInfinite from "swr/infinite";
import {
  FollowNetworkDetails,
  getFollowNetworkDetails,
} from "../actions/getFollowNetworkDetails";

export const useFollowNetwork = (
  token: string,
  loggedInFarmId: number,
  networkFarmId: number,
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: FollowNetworkDetails | null,
  ) => {
    if (pageIndex === 0) return `followNetworkDetails-${networkFarmId}-0`;

    if (!previousPageData?.data?.nextCursor) return null;

    return `followNetworkDetails-${networkFarmId}-${previousPageData.data.nextCursor}`;
  };

  const { data, size, error, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const parts = key.split("-");
      const cursor = parts[2];
      const nextCursor = cursor === "0" ? 0 : Number(cursor);

      return getFollowNetworkDetails({
        token,
        farmId: loggedInFarmId,
        networkFarmId,
        nextCursor,
      });
    },
    {
      revalidateFirstPage: false,
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
