import { CONFIG } from "lib/config";

type Request = {
  token: string;
  farmId: number;
  followedPlayerId: number;
};

type Player = {
  data?: {
    farmId: number;
    following: number[];
    followingCount: number;
    followedBy: number[];
    followedByCount: number;
    messages: { message: "niceFarm" }[];
  };
};

export const getPlayer = async ({
  token,
  farmId,
  followedPlayerId,
}: Request): Promise<Player> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=player&farmId=${farmId}&followedPlayerId=${followedPlayerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response;
};
