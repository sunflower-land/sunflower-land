import type { Marketplace } from "features/game/types/marketplace";
import { secureFetch } from "lib/requestToken";
import { CONFIG } from "lib/config";
import { apiError } from "lib/apiError";
import { randomID } from "lib/utils/random";

const API_URL = CONFIG.API_URL;

export async function loadMarketplace({
  filters,
  token,
}: {
  filters: string; // Comma separated list of filters
  token: string;
}): Promise<Marketplace> {
  const url = new URL(`${API_URL}/marketplace?filters=${filters}`);
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
      endpoint: "GET /marketplace",
      transactionId,
      meta: { filters, hasToken: !!token },
    });
  }

  return await response.json();
}
