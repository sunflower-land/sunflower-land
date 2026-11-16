import type { MarketplaceProfile } from "features/game/types/marketplace";
import { secureFetch } from "lib/requestToken";
import { CONFIG } from "lib/config";
import { apiError } from "lib/apiError";
import { randomID } from "lib/utils/random";

const API_URL = CONFIG.API_URL;

export async function loadProfile({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<MarketplaceProfile> {
  const url = new URL(`${API_URL}/marketplace/profile/${id}`);
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
      endpoint: "GET /marketplace/profile/:id",
      transactionId,
      meta: { profileId: id, hasToken: !!token },
    });
  }

  return await response.json();
}
