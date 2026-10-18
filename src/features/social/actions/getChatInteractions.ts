import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import type { Interaction } from "../types/types";

type Request = {
  token: string;
  farmId: number;
  followedPlayerId: number;
  cursor?: number;
};

export const getChatInteractions = async ({
  token,
  farmId,
  followedPlayerId,
  cursor,
}: Request): Promise<Interaction[]> => {
  const res = await fetchWithRetry(
    `${CONFIG.API_URL}/data?type=chatInteractions&farmId=${farmId}&followedPlayerId=${followedPlayerId}&cursor=${cursor}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response.data.interactions ?? [];
};
