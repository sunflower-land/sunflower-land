import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { InventoryItemName } from "../types/game";

const API_URL = CONFIG.API_URL;

export type Listing = {
  type: string;
  id: string;
  farmId: number;
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  createdAt: number;
  boughtAt?: number;
  boughtById?: number;
};

export async function getTradeListings(
  type: string,
  token?: string
): Promise<Listing[]> {
  // Append the `type` query parameter to the URL
  const url = new URL(`${API_URL}/listings`);
  url.searchParams.append("type", type);

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
