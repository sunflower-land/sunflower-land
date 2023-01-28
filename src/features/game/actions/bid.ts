import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { makeGame } from "../lib/transforms";
import { AuctioneerItemName } from "../types/auctioneer";

type Request = {
  farmId: number;
  sessionId: string;
  item: AuctioneerItemName;
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function bid(request: Request) {
  const response = await window.fetch(`${API_URL}/bid/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      sessionId: request.sessionId,
      item: request.item,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const data = await response.json();

  const game = makeGame(data.game);

  return { verified: true, game };
}
