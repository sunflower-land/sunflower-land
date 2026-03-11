import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { LeaderboardBid } from "../lib/auctionMachine";

type Request = {
  farmId: number;
  auctionId: string;
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

type Status = "pending" | "winner" | "loser";

export async function getAuctionResults(request: Request): Promise<{
  status: Status;
  leaderboard: LeaderboardBid[];
  participantCount: number;
  supply: number;
  endAt: number;
}> {
  const response = await window.fetch(
    `${API_URL}/auction/${request.auctionId}/results/${request.farmId}`,
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
    throw new Error(ERRORS.AUCTION_RESULTS_SERVER_ERROR);
  }

  const { status, leaderboard, supply, participantCount, endAt } =
    await response.json();

  return { status, leaderboard, supply, participantCount, endAt };
}
