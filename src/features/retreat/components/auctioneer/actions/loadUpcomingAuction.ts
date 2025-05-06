import { Auction } from "features/game/lib/auctionMachine";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadUpcomingAuction(
  request: Request,
): Promise<Auction | undefined> {
  const response = await window.fetch(`${API_URL}/data?type=upcomingAuction`, {
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
    throw new Error(ERRORS.AUCTIONEER_UPCOMING_AUCTION_NOT_FOUND);
  }

  return await response.json();
}
