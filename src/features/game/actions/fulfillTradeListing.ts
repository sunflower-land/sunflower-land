import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

type Request = {
  sellerId: number;
  buyerId: number;
  listingId: string;
  listingType: string;
  token: string;
};
type Response = {
  farm: GameState;
  error?: "ALREADY_BOUGHT";
};

export async function fulfillTradeListingRequest(
  request: Request
): Promise<Response> {
  const response = await window.fetch(`${API_URL}/listings`, {
    method: "PUT",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      accept: "application/json",
      ...((window as any)["x-amz-ttl"]
        ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] }
        : {}),
    },
    body: JSON.stringify({
      sellerId: request.sellerId,
      buyerId: request.buyerId,
      listingId: request.listingId,
      listingType: request.listingType,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.PURCHASE_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  return { farm: makeGame(data.farm), error: data.error };
}
