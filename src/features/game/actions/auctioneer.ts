import { Item } from "features/retreat/components/auctioneer/actions/auctioneerItems";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Cache = {
  cachedAt: number;
  items: Item[];
};

const CACHE_KEY = "auctioneer.items";
const CACHE_MINUTES = 5;

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

export const fetchAuctioneerDrops = async (token: string) => {
  const cache = loadCachedItems();

  if (cache) {
    return { items: cache.items };
  }
  const response = await window.fetch(`${CONFIG.API_URL}/auctioneer`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const {
    auctioneer: items,
  }: {
    auctioneer: Item[];
  } = await response.json();

  cacheItems(items);

  return { items };
};
