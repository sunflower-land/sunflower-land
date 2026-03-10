import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { RaffleDefinition } from "../../../../retreat/components/auctioneer/types";
import {
  getChapterRaffleTicket,
  getChapterTicket,
} from "features/game/types/chapters";

type Request = {
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadRaffles(
  request: Request,
): Promise<RaffleDefinition[]> {
  if (!CONFIG.API_URL) {
    const now = Date.now();
    const chapterTicket = getChapterTicket(now);
    const raffleTicket = getChapterRaffleTicket(now);
    return [
      {
        id: "1",
        startAt: Date.now(),
        endAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        prizes: {
          1: {
            type: "wearable",
            wearables: {
              "Acorn Hat": 1,
            },
          },
          2: {
            type: "collectible",
            items: { Gold: 5 },
          },
          3: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          4: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          5: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          6: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          7: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          8: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          9: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          10: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          11: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          12: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          13: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          14: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
        },
        entryRequirements: {
          [chapterTicket]: 10,
          [raffleTicket]: 1,
          Gold: 1,
        },
      },
      {
        id: "3",
        startAt: Date.now(),
        endAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        prizes: {
          1: {
            type: "collectible",
            items: { Crimstone: 1 },
          },
          2: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          3: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
        },
        entryRequirements: {
          [chapterTicket]: 10,
          [raffleTicket]: 1,
        },
      },
      {
        id: "2",
        startAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        endAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        prizes: {
          1: {
            type: "wearable",
            wearables: {
              "Acorn Hat": 1,
            },
          },
          2: {
            type: "collectible",
            items: { Gold: 5 },
          },
          3: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          4: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          5: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          6: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          7: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          8: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          9: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          10: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          11: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          12: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
          13: {
            type: "Pet",
            nft: "Pet #4",
            onChain: true,
          },
          14: {
            type: "collectible",
            items: { Iron: 5, Stone: 5, Wood: 2 },
          },
        },
        entryRequirements: {
          [chapterTicket]: 10,
          [raffleTicket]: 1,
        },
      },
    ];
  }
  const response = await window.fetch(`${API_URL}/data?type=raffles`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  const { data } = await response.json();

  return data;
}
