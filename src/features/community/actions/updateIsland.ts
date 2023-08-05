import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Wardrobe } from "features/game/types/game";
import { InventoryItemName } from "../types/community";

type Request = {
  token: string;
  islandId: string;
  farmId: number;
  apiKey: string;
  metadata: string;
  mintItems?: Partial<Record<InventoryItemName, number>>;
  mintWearables?: Wardrobe;
  burnItems?: Partial<Record<InventoryItemName, number>>;
  burnSFL?: number;
  transactionId?: string;
};

type Response = {
  updatedAt: number;
};

const API_URL = CONFIG.API_URL;

/**
 * An example POST request for updating island data
 * You should never store your ApiKey on the client side
 * Only exceptions are low-risk/impact situations. Assume your data can be changed at will
 */
export async function updateIsland(
  request: Request
): Promise<Response | undefined> {
  if (!API_URL) return;

  const response = await window.fetch(
    `${API_URL}/island/${request.islandId}/farm/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
        "X-Transaction-ID": request.transactionId ?? "",
      },
      body: JSON.stringify({
        apiKey: request.apiKey,
        metadata: request.metadata,
        mintItems: request.mintItems,
        mintWearables: request.mintWearables,
        burnItems: request.burnItems,
        burnSFL: request.burnSFL,
      }),
    }
  );

  if (response.status === 503) {
    throw new Error(ERRORS.MAINTENANCE);
  }

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status === 401) {
    throw new Error(ERRORS.SESSION_EXPIRED);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.SESSION_SERVER_ERROR);
  }

  const { updatedAt } = await response.json();

  return {
    updatedAt,
  };
}
