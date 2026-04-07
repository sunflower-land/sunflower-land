import type {
  EconomyMinigameRank,
  Tradeable,
} from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export type MarketplaceEconomiesPageData = {
  items: Extract<Tradeable, { collection: "economies" }>[];
  economyMinigameRanks: EconomyMinigameRank[];
};

export async function loadMarketplaceEconomiesPage({
  token,
}: {
  token: string;
}): Promise<MarketplaceEconomiesPageData> {
  const url = new URL(`${API_URL}/data`);
  url.searchParams.set("type", "marketplaceEconomies");

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

  const body = (await response.json()) as {
    data: MarketplaceEconomiesPageData;
  };
  return body.data;
}

export const marketplaceEconomiesPageSwrKey = (token: string) =>
  ["marketplaceEconomies", token] as const;

export async function marketplaceEconomiesPageFetcher(
  args: readonly [string, string],
) {
  const [, token] = args;
  return loadMarketplaceEconomiesPage({ token });
}
