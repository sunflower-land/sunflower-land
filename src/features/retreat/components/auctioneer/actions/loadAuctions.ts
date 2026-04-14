import { Auction } from "features/game/lib/auctionMachine";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadAuctions(request: Request): Promise<{
  auctions: Auction[];
  totalSupply: Record<string, number>;
}> {
  if (!API_URL) {
    return {
      auctions: [
        {
          auctionId: "offline-auction-1",
          type: "wearable",
          wearable: "Acorn Hat",
          startAt: Date.now() + 60 * 60 * 1000,
          endAt: Date.now() + 2 * 60 * 60 * 1000,
          ingredients: { Wood: 1, Gold: 10 },
          sfl: 5,
          supply: 500,
          chapterLimit: 1,
        },
        {
          auctionId: "offline-auction-2",
          type: "wearable",
          wearable: "Acorn Hat",
          startAt: Date.now() + 2 * 60 * 60 * 1000,
          endAt: Date.now() + 4 * 60 * 60 * 1000,
          ingredients: { Gem: 1 },
          sfl: 5,
          supply: 500,
          chapterLimit: 1,
        },
        {
          auctionId: "offline-auction-3",
          type: "collectible",
          collectible: "Sir Goldensnout",
          startAt: Date.now() + 2 * 60 * 60 * 1000,
          endAt: Date.now() + 4 * 60 * 60 * 1000,
          ingredients: {},
          sfl: 5,
          supply: 500,
          chapterLimit: 1,
        },
      ],
      totalSupply: {},
    };
  }

  const response = await window.fetch(`${API_URL}/auctions`, {
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
    throw new Error(ERRORS.AUCTIONEER_SERVER_ERROR);
  }

  const { auctions } = await response.json();

  return { auctions: auctions.auctions, totalSupply: auctions.totalSupply };
}
