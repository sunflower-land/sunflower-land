import {
  CollectionName,
  MarketplaceProfile,
  TradeableDetails,
} from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export async function loadProfile({
  id,
  token,
}: {
  id: number;
  token: string;
}): Promise<MarketplaceProfile> {
  const url = new URL(`${API_URL}/marketplace/profile/${id}`);

  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return await response.json();
}
