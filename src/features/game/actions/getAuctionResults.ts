import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { AuctioneerItemName } from "../types/auctioneer";

type Request = {
  farmId: number;
  item: AuctioneerItemName;
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

type Status = "pending" | "winner" | "loser";

export async function getAuctionResults(request: Request): Promise<{
  status: Status;
  minimum: {
    auctionTickets: number;
    biddedAt: number;
  };
  participantCount: number;
  supply: number;
}> {
  const response = await window.fetch(
    `${API_URL}/auction/${request.item}/results/${request.farmId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const { status, minimum, supply, participantCount } = await response.json();

  return { status, minimum, supply, participantCount };
}
