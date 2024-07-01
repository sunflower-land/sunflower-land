import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { makeGame } from "../lib/transforms";

type Request = {
  farmId: number;
  auctionId?: string;
  token: string;
  transactionId: string;
  tickets: number;
};

const API_URL = CONFIG.API_URL;

export async function bid(request: Request) {
  const response = await window.fetch(
    `${API_URL}/auction/bid/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        auctionId: request.auctionId,
        tickets: request.tickets,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const data = await response.json();

  const game = makeGame(data.farm);

  return { verified: true, game };
}
