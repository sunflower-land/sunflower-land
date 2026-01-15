import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type RaffleWinner = {
  farmId: number;
  position: number;
  entries: number;
  ticketsUsed: number;
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Record<BumpkinItem, number>>;
  sfl?: number;
  profile?: {
    username: string;
    level: number;
    equipped?: BumpkinParts;
  };
};

export type RaffleResults = {
  status: "pending" | "complete";
  raffleId: string;
  endAt: number;
  winners: RaffleWinner[];
};

type Request = {
  id: string;
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadRaffleResults(
  request: Request,
): Promise<RaffleResults> {
  const response = await window.fetch(
    `${API_URL}/data?type=raffleResults&id=${request.id}`,
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

  return data;
}
