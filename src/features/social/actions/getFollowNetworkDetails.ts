import { CONFIG } from "lib/config";

type Request = {
  token: string;
  farmId: number;
  networkFarmId: number;
};

type Detail = {
  tokenUri: string;
  username: string;
  lastUpdatedAt: number;
};

type FollowNetworkDetails = {
  data: {
    id: number;
    network: {
      [key: number]: Detail;
    };
  };
};

export const getFollowNetworkDetails = async ({
  token,
  farmId,
  networkFarmId,
}: Request): Promise<FollowNetworkDetails> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=followNetworkDetails&networkFarmId=${networkFarmId}&farmId=${farmId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response;
};
