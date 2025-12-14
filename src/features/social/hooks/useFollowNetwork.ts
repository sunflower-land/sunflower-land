import { useInfiniteQuery } from "@tanstack/react-query";
import { socialKeys } from "lib/query/queryKeys";
import {
  FollowNetworkMember,
  getFollowNetworkDetails,
} from "../actions/getFollowNetworkDetails";

export const useFollowNetwork = (
  token: string,
  loggedInFarmId: number,
  networkFarmId: number,
  networkType: "followers" | "following",
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: socialKeys.followNetwork(
      networkFarmId,
      loggedInFarmId,
      networkType,
    ),
    queryFn: ({ pageParam }) =>
      getFollowNetworkDetails({
        token,
        farmId: loggedInFarmId,
        networkFarmId,
        networkType,
        nextCursor: pageParam ?? undefined,
      }),
    initialPageParam: null as FollowNetworkMember | null,
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? undefined,
  });

  const network = data?.pages.flatMap((page) => page.data.network) ?? [];

  return {
    network,
    isLoadingInitialData: isFetching && !data,
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore: () => fetchNextPage(),
    error,
    mutate: refetch,
  };
};
