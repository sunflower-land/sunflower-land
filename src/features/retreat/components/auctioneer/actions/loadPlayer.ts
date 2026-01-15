import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type RafflePlayer = {
  id: number;
  username: string;
  level: number;
  clothing: BumpkinParts;
};

type Request = {
  farmId: number;
  followedPlayerId: number;
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadPlayer(
  request: Request,
): Promise<RafflePlayer | null> {
  const response = await window.fetch(
    `${API_URL}/data?type=player&farmId=${request.farmId}&followedPlayerId=${request.followedPlayerId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.UNEXPECTED_SERVER_RESPONSE);
  }

  const { data } = await response.json();

  return data ?? null;
}
