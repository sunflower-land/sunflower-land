import type {
  EconomyExchange,
  EconomyExchangeOffer,
  EconomyListRow,
  EconomyMinigameRank,
  PlayerEconomySummary,
  Tradeable,
} from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

export type MarketplaceEconomiesPageData = {
  items: Extract<Tradeable, { collection: "economies" }>[];
  economyMinigameRanks: EconomyMinigameRank[];
};

// -----------------------------------------------------------------------------
// Offline mock data
// -----------------------------------------------------------------------------
// When `CONFIG.API_URL` is unset the app is in "offline / local" mode — there
// is no backend to hit. We still want the Economy Hub to render something
// realistic so designers and developers can work on it without a server.
//
// The mocks below live next to the real loaders on purpose: components stay
// oblivious to whether the data is live or faked, and any shape change to
// the response types is caught here at compile time.
// -----------------------------------------------------------------------------

const MOCK_EXCHANGES_BY_SLUG: Record<string, EconomyExchange[]> = {
  "chicken-rescue": [
    {
      id: "mock-chicken-rescue-1",
      economySlug: "chicken-rescue",
      economyLabel: "Chicken Rescue",
      itemName: "Chicken Feet",
      itemAmount: 5,
      rewardName: "Marks",
      rewardAmount: 25,
    },
    {
      id: "mock-chicken-rescue-2",
      economySlug: "chicken-rescue",
      economyLabel: "Chicken Rescue",
      itemName: "Chicken Eggs",
      itemAmount: 5,
      rewardName: "Marks",
      rewardAmount: 3,
    },
  ],
  "crop-carnival": [
    {
      id: "mock-crop-carnival-1",
      economySlug: "crop-carnival",
      economyLabel: "Crop Carnival",
      itemName: "Gold Nugget",
      itemAmount: 5,
      rewardName: "Marks",
      rewardAmount: 25,
    },
    {
      id: "mock-crop-carnival-2",
      economySlug: "crop-carnival",
      economyLabel: "Crop Carnival",
      itemName: "Carrots",
      itemAmount: 10,
      rewardName: "Marks",
      rewardAmount: 8,
      claimed: true,
    },
  ],
  "pumpkin-panic": [
    {
      id: "mock-pumpkin-panic-1",
      economySlug: "pumpkin-panic",
      economyLabel: "Pumpkin Panic",
      itemName: "Pumpkin Seeds",
      itemAmount: 20,
      rewardName: "Marks",
      rewardAmount: 12,
    },
  ],
};

const MOCK_ECONOMIES_LIST: EconomyListRow[] = [
  {
    slug: "chicken-rescue",
    label: "Chicken Rescue",
    description: "Rescue chickens from marauding foxes across the coop.",
    playerCount: 412,
    marketplaceItemId: 1,
    trophyTotal: 5,
    trophiesCollected: 2,
  },
  {
    slug: "crop-carnival",
    label: "Crop Carnival",
    description: "Race against the clock to harvest the most crops.",
    playerCount: 348,
    marketplaceItemId: 2,
    trophyTotal: 4,
    trophiesCollected: 4,
  },
  {
    slug: "festival-of-colors",
    label: "Festival of Colors",
    description: "Paint the town and earn tokens from every splash.",
    playerCount: 201,
    marketplaceItemId: 3,
    trophyTotal: 6,
    trophiesCollected: 0,
  },
  {
    slug: "easter-egg-hunt",
    label: "Easter Egg Hunt",
    description: "Find the hidden eggs before the timer runs out.",
    playerCount: 187,
    marketplaceItemId: 4,
    trophyTotal: 3,
    trophiesCollected: 1,
  },
  {
    slug: "mermaid-splash",
    label: "Mermaid Splash",
    description: "Dive deep to surface the rarest treasures.",
    playerCount: 96,
    marketplaceItemId: 5,
    trophyTotal: 0,
    trophiesCollected: 0,
  },
  {
    slug: "pumpkin-panic",
    label: "Pumpkin Panic",
    description: "Carve pumpkins faster than your rivals.",
    playerCount: 64,
    marketplaceItemId: 6,
    trophyTotal: 5,
    trophiesCollected: 3,
  },
];

function mockEconomyExchangeOffers(): EconomyExchangeOffer[] {
  const out: EconomyExchangeOffer[] = [];
  for (const [slug, rows] of Object.entries(MOCK_EXCHANGES_BY_SLUG)) {
    for (const ex of rows) {
      out.push({
        id: ex.id,
        slug,
        requirements: { [ex.itemName]: ex.itemAmount },
        rewards: { items: { [ex.rewardName]: ex.rewardAmount } },
        ...(ex.claimed ? { completedAt: Date.now() } : {}),
      });
    }
  }
  return out;
}

const MOCK_MARKETPLACE_ECONOMIES_ITEMS: Extract<
  Tradeable,
  { collection: "economies" }
>[] = [
  {
    id: 1,
    floor: 0.12,
    lastSalePrice: 0.15,
    isActive: true,
    isVip: false,
    supply: 1200,
    collection: "economies",
    economy: "chicken-rescue",
    economyLabel: "Chicken Rescue",
    currencyName: "Chicken Feet",
    currencyDisplayName: "Chicken Feet",
    volume: 820,
  },
  {
    id: 2,
    floor: 0.08,
    lastSalePrice: 0.1,
    isActive: true,
    isVip: false,
    supply: 3500,
    collection: "economies",
    economy: "crop-carnival",
    economyLabel: "Crop Carnival",
    currencyName: "Carrots",
    currencyDisplayName: "Carrots",
    volume: 540,
  },
  {
    id: 3,
    floor: 0.22,
    lastSalePrice: 0.25,
    isActive: true,
    isVip: false,
    supply: 400,
    collection: "economies",
    economy: "festival-of-colors",
    economyLabel: "Festival of Colors",
    currencyName: "Paint Drops",
    currencyDisplayName: "Paint Drops",
    volume: 310,
  },
];

const MOCK_MINIGAME_RANKS: EconomyMinigameRank[] = MOCK_ECONOMIES_LIST.map(
  (economy) => ({
    economy: economy.slug,
    economyLabel: economy.label,
    playerCount: economy.playerCount,
    marketplaceItemId: economy.marketplaceItemId,
    image: economy.image,
  }),
);

/** Sentinel value used for the SWR token slot when the app is offline. */
const OFFLINE_TOKEN = "__offline__";

/**
 * True when the app is running without a backend (local/dev build without
 * `CONFIG.API_URL`). Callers should use this to bypass feature-flag and
 * farm-id gates so the Economy Hub still renders with mock data.
 */
export const isEconomyHubOffline = (): boolean => !API_URL;

// -----------------------------------------------------------------------------
// Loaders
// -----------------------------------------------------------------------------

export async function loadMarketplaceEconomiesPage({
  token,
}: {
  token: string;
}): Promise<MarketplaceEconomiesPageData> {
  if (!API_URL) {
    return {
      items: MOCK_MARKETPLACE_ECONOMIES_ITEMS,
      economyMinigameRanks: MOCK_MINIGAME_RANKS,
    };
  }

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
  ["marketplaceEconomies", token || OFFLINE_TOKEN] as const;

export async function marketplaceEconomiesPageFetcher(
  args: readonly [string, string],
) {
  const [, token] = args;
  return loadMarketplaceEconomiesPage({
    token: token === OFFLINE_TOKEN ? "" : token,
  });
}

export type EconomiesListPageData = {
  economies: EconomyListRow[];
  exchanges: EconomyExchangeOffer[];
  playerEconomies: Record<string, PlayerEconomySummary>;
};

export async function loadEconomiesListPage({
  token,
  farmId,
}: {
  token: string;
  farmId: number;
}): Promise<EconomiesListPageData> {
  if (!API_URL) {
    return {
      economies: MOCK_ECONOMIES_LIST,
      exchanges: mockEconomyExchangeOffers(),
      playerEconomies: {},
    };
  }

  const url = new URL(`${API_URL}/data`);
  url.searchParams.set("type", "economies");
  url.searchParams.set("farmId", String(farmId));

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
    data: EconomiesListPageData;
  };
  return {
    economies: body.data.economies ?? [],
    exchanges: body.data.exchanges ?? [],
    playerEconomies: body.data.playerEconomies ?? {},
  };
}

export const economiesListPageSwrKey = (token: string, farmId: number) =>
  ["economies", token || OFFLINE_TOKEN, farmId] as const;

export async function economiesListPageFetcher(
  args: readonly [string, string, number],
) {
  const [, token, farmId] = args;
  return loadEconomiesListPage({
    token: token === OFFLINE_TOKEN ? "" : token,
    farmId,
  });
}
