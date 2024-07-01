import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { TradeableName } from "./sellMarketResource";

const API_URL = CONFIG.API_URL;

export type MarketPrices = {
  currentPrices: Record<TradeableName, number>;
  yesterdayPrices: Record<TradeableName, number>;
};

export async function getMarketPrices(
  farmId: number,
  transactionId: string,
  token: string,
): Promise<MarketPrices> {
  // Append the `type` query parameter to the URL
  const url = new URL(`${API_URL}/market/${farmId}`);

  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.MARKET_PRICE_SERVER_ERROR);
  }

  return await response.json();
}
