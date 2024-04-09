import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GameState, InventoryItemName } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

export type TradeableName = Extract<
  InventoryItemName,
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Eggplant"
  | "Corn"
  | "Radish"
  | "Wheat"
  | "Kale"
  | "Blueberry"
  | "Orange"
  | "Apple"
  | "Banana"
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Egg"
>;

type Request = {
  farmId: number;
  item: TradeableName;
  soldAt: string;
  token: string;
  pricePerUnit: number;
};

type Response = {
  farm: GameState;
  prices: Record<TradeableName, number>;
  error?: "PRICE_CHANGED";
};

export async function sellMarketResourceRequest(
  request: Request
): Promise<Response> {
  const response = await window.fetch(`${API_URL}/market/${request.farmId}`, {
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
      item: request.item,
      soldAt: request.soldAt,
      pricePerUnit: request.pricePerUnit,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.SELL_MARKET_RESOURCE_SERVER_ERROR);
  }

  const data = await response.json();

  return { farm: makeGame(data.farm), prices: data.prices, error: data.error };
}
