import { CONFIG } from "lib/config";
import { Player } from "../types/types";

type Request = {
  token: string;
  farmId: number;
  followedPlayerId: number;
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
