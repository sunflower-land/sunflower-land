import { Item } from "features/retreat/components/auctioneer/actions/auctioneerItems";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Cache = {
  cachedAt: number;
  items: Item[];
  id: string;
};
const host = window.location.host.replace(/^www\./, "");
const CACHE_KEY = `auctioneer.items.${host}-${window.location.pathname}`;
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

function cacheItems(id: string, items: Item[]) {
  const cache: Cache = {
    cachedAt: Date.now(),
    id,
    items,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export const fetchAuctioneerDrops = async (token: string) => {
  const cache = loadCachedItems();

  if (cache) {
    return { id: cache.id, items: cache.items };
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
    id,
  }: {
    auctioneer: Item[];
    id: string;
  } = await response.json();

  cacheItems(id, items);

  return { id, items };
};

export const fetchAuctioneerSupply = (ids: number[]) => {
  return wallet.getInventory().getSupply(ids);
};
