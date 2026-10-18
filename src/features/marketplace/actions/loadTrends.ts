import type { MarketplaceTrends } from "features/game/types/marketplace";
import { secureFetch } from "lib/requestToken";
import { CONFIG } from "lib/config";
import { apiError } from "lib/apiError";
import { randomID } from "lib/utils/random";

const API_URL = CONFIG.API_URL;

export async function loadTrends({
  token,
}: {
  token: string;
}): Promise<MarketplaceTrends> {
  const url = new URL(`${API_URL}/marketplace/trends`);
  const transactionId = randomID();

  const response = await secureFetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": transactionId,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status >= 400) {
    throw await apiError(response, {
      endpoint: "GET /marketplace/trends",
      transactionId,
      meta: { hasToken: !!token },
    });
  }

  return await response.json();
}
