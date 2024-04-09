import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GameState, InventoryItemName } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

type Request = {
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  sellerId: number;
  token: string;
};

export async function listRequest(request: Request): Promise<GameState> {
  const response = await window.fetch(`${API_URL}/listings`, {
    method: "POST",
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
      items: request.items,
      sfl: request.sfl,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.LIST_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  return makeGame(data);
}
