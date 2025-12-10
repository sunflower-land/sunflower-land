import {
  CollectionName,
  TradeableDetails,
} from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export async function loadTradeable({
  type,
  id,
  token,
  attempts = 0,
}: {
  type: CollectionName;
  id: number;
  token: string;
  attempts?: number;
}): Promise<TradeableDetails> {
  if (!CONFIG.API_URL)
    return {
      id,
      floor: 0,
      supply: 0,
      collection: type,
      isActive: false,
      isVip: false,
      lastSalePrice: 0,
      offers: [],
      listings: [],
      history: {
        sales: [],
        history: {
          totalSales: 0,
          totalVolume: 0,
          dates: {},
        },
      },
    };

  const url = new URL(`${API_URL}/collection/${type}/${id}`);
  url.searchParams.append("type", type);

  const response = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    if (attempts < 3) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await loadTradeable({ type, id, token, attempts: attempts + 1 });
    }

    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return await response.json();
}
