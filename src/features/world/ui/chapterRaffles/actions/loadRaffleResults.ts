import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { NPC_WEARABLES } from "lib/npcs";
import { RaffleRewards } from "features/retreat/components/auctioneer/types";

export type RaffleSnapshotWinner = {
  farmId: number;
  position: number;
  entries: number;
  ticketsUsed: number;
  sfl?: number;
  onChain?: boolean;
  profile?: {
    username: string;
    level: number;
    equipped?: BumpkinParts;
  };
} & RaffleRewards;

export type RaffleResults = {
  status: "pending" | "complete";
  raffleId: string;
  endAt: number;
  winners: RaffleSnapshotWinner[];
  participants: number;
  entries: number;
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
  if (!CONFIG.API_URL) {
    return {
      status: "complete",
      raffleId: request.id,
      endAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      winners: [
        {
          farmId: 1,
          position: 1,
          entries: 10,
          ticketsUsed: 10,
          type: "Pet",
          nft: "Pet #4",
          onChain: true,
          profile: {
            level: 22,
            equipped: NPC_WEARABLES.adam,
            username: "Adam",
          },
        },
        {
          farmId: 2,
          position: 2,
          entries: 10,
          ticketsUsed: 10,
          type: "collectible",
          items: { Gold: 10 },
          profile: {
            level: 122,
            equipped: NPC_WEARABLES.gordy,
            username: "Gordy",
          },
        },
      ],
      participants: 0,
      entries: 0,
    };
  }
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
    throw new Error(ERRORS.RAFFLE_RESULTS_SERVER_ERROR);
  }

  const { data } = await response.json();

  return data;
}
