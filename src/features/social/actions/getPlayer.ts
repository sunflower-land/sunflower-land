import { CONFIG } from "lib/config";

type Request = {
  token: string;
  farmId: number;
};

type Player = {
  data?: {
    farmId: number;
    following: number[];
    followingCount: number;
    followedBy: number[];
    followedByCount: number;
  };
};

export const getPlayer = async ({
  token,
  farmId,
}: Request): Promise<Player> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=player&farmId=${farmId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response;
};
