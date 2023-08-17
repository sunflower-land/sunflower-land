import { purchaseTrade } from "lib/blockchain/Game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { toWei } from "web3-utils";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

type Request = {
  buyerId: number;
  sellerId: number;
  token: string;
  tradeId: string;
  transactionId: string;
};

type Response = {
  farm: GameState;
};

export async function trade(request: Request): Promise<Response> {
  const response = await window.fetch(`${API_URL}/trade/${request.buyerId}`, {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      accept: "application/json",
      ...((window as any)["x-amz-ttl"]
        ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] }
        : {}),
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      tradeId: request.tradeId,
      sellerId: request.sellerId,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.PURCHASE_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  const farm = makeGame(data.farm);

  return { farm };
}
