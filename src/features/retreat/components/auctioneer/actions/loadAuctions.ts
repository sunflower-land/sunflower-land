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
}> {
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

  return { auctions };
}
