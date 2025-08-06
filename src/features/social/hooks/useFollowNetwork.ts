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
    _: number,
    previousPageData: FollowNetworkDetails["data"],
  ) => {
    if (previousPageData && !previousPageData.nextCursor) return null;

    return `followNetworkDetails-${networkFarmId}-${previousPageData?.nextCursor ?? "initial"}`;
  };

  const { data, size, error, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const parts = key.split("-");
      const cursor = parts[2];
      const nextCursor = cursor === "initial" ? undefined : cursor;

      return getFollowNetworkDetails({
        token,
        farmId: loggedInFarmId,
        networkFarmId,
        nextCursor,
      });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const network = data?.flatMap((page) => page.data.network) ?? [];

  return {
    network,
    isLoading: isValidating,
    size,
    error,
    setSize,
    isValidating,
    mutate,
  };
};
