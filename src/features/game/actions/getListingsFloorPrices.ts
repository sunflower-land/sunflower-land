import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { InventoryItemName } from "../types/game";

const API_URL = CONFIG.API_URL;

export type FloorPrices = Partial<Record<InventoryItemName, number>>;

export async function getListingsFloorPrices(
  token?: string,
): Promise<FloorPrices[]> {
  // Append the `type` query parameter to the URL
  const url = new URL(`${API_URL}/listingsFloor`);

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
