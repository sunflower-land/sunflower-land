import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { BumpkinItem, BumpkinPart } from "features/game/types/bumpkin";
import { Release } from "../TabContent";
import { MOCK_SHOP } from "./mockShopItems";
import { wallet } from "lib/blockchain/wallet";
import { loadSupplyBatch } from "lib/blockchain/BumpkinItems";

const API_URL = CONFIG.API_URL;

export interface BumpkinShopItem {
  name: BumpkinItem;
  tokenId: number;
  totalMinted?: number;
  part?: BumpkinPart;
  price?: number;
  releases: Release[];
  currentRelease?: Release;
}

export type Shop = {
  items: BumpkinShopItem[];
};

const CACHE_KEY = "bumpkin.shopItems";
const CACHE_MINUTES = 5;

type Cache = {
  cachedAt: number;
  items: Item[];
};

export type Item = {
  id: number;
  releases: Release[];
  name: BumpkinItem;
};

export function isCommon(releases: Release[]) {
  return releases.length === 1 && !releases[0]?.endDate;
}

const isReleased = (releases: Release[]) => {
  const releasedInGame = releases.length === 0;

  if (releasedInGame) return true;

  if (isCommon(releases) && releases[0].releaseDate < Date.now()) return true;

  const { endDate } = releases[releases.length - 1];

  return endDate && endDate < Date.now();
};

/**
 * Cache items for snappy page changes
 */
function loadCachedItems(): Cache | null {
  const stored = localStorage.getItem(CACHE_KEY);

  if (!stored) {
    return null;
  }

  const cache = JSON.parse(stored) as Cache;

  // Expired
  if (cache.cachedAt < Date.now() - CACHE_MINUTES * 60 * 1000) {
    return null;
  }

  return cache;
}

function cacheItems(items: Item[]) {
  const cache: Cache = {
    cachedAt: Date.now(),
    items,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export async function fetchAllItems() {
  const cache = loadCachedItems();

  if (cache) {
    return { items: cache.items };
  }

  const response = await window.fetch(`${API_URL}/bumpkins/collection`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const {
    items,
  }: {
    items: Item[];
  } = await response.json();

  cacheItems(items);

  return {
    items,
  };
}

async function loadItems(): Promise<BumpkinShopItem[]> {
  if (!CONFIG.API_URL) {
    return MOCK_SHOP;
  }

  const { items } = await fetchAllItems();
  const ids = items.map((item) => item.id);
  let supply: string[] = [];

  try {
    supply = await loadSupplyBatch(wallet.web3Provider, ids);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Loading supply failed: ", e);
  }

  return items
    .map((item, index) => {
      // This will be a collection item that is always available to buy on the bumpkins.io site
      const price = isCommon(item.releases)
        ? Number(item.releases[0].price)
        : undefined;

      return {
        totalMinted: supply[index] ? Number(supply[index]) : undefined,
        name: item.name,
        price,
        tokenId: item.id,
        releases: item.releases,
      };
    })
    .filter(({ releases }) => isReleased(releases));
}

export async function loadCollection(): Promise<BumpkinShopItem[]> {
  const items = await loadItems();

  return items.sort((first, second) => {
    const firstIsCommon = isCommon(first.releases);
    const secondIsCommon = isCommon(second.releases);

    // 1/2. Sort common items by price
    if (firstIsCommon && secondIsCommon) {
      return (
        Number(first.releases[0]?.price ?? 0) -
        Number(second.releases[0]?.price ?? 0)
      );
    }

    if (!firstIsCommon && secondIsCommon) {
      return 1;
    }

    if (firstIsCommon && !secondIsCommon) {
      return -1;
    }

    // 5. Sort by released versus coming soon
    const firstIsReleased = isReleased(first.releases);
    const secondIsReleased = isReleased(second.releases);

    if (!firstIsReleased && secondIsReleased) {
      return 1;
    }

    if (firstIsReleased && !secondIsReleased) {
      return -1;
    }

    // Sort by supply
    return (first?.totalMinted ?? 0) - (second.totalMinted ?? 0);
  });
}

export async function loadCurrentAndUpcomingDrops(): Promise<
  BumpkinShopItem[]
> {
  const { items } = await fetchAllItems();

  const sortedUpcomingItemNames = items
    .filter((item) => {
      if (item.releases.length === 0 || isCommon(item.releases)) return false;

      const now = Date.now();
      const { endDate } = item.releases[item.releases.length - 1];

      return endDate && endDate > now;
    })
    .sort((a, b) => a.releases[0].releaseDate - b.releases[0].releaseDate)
    .slice(0, 10);

  const upcomingItems = sortedUpcomingItemNames.map((item) => {
    const currentRelease = item.releases.find((release) => {
      const { endDate } = release;

      return endDate && endDate > Date.now();
    });

    return {
      name: item.name,
      tokenId: item.id,
      maxSupply: getMaxSupply(item.releases),
      releases: item.releases,
      currentRelease,
    };
  });

  return upcomingItems;
}

export function getMaxSupply(releases: Release[]) {
  return releases.reduce((supply, release) => {
    supply += release.supply;

    return supply;
  }, 0);
}

export type SingleBumpkinItem = BumpkinShopItem & {
  maxSupply: number;
  releases: Release[];
};
