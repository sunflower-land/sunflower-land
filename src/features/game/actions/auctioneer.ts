import { AuctioneerItem } from "features/retreat/components/auctioneer/actions/auctioneerItems";
import { getInventorySupply } from "lib/blockchain/Inventory";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { KNOWN_IDS } from "../types";

type Cache = {
  cachedAt: number;
  items: AuctioneerItem[];
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

function cacheItems(id: string, items: AuctioneerItem[]) {
  const cache: Cache = {
    cachedAt: Date.now(),
    id,
    items,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export const OFFLINE_AUCTION_ITEMS: AuctioneerItem[] = [
  {
    name: "Cyborg Bear",
    endDate: Date.now() + 60 * 60 * 1000,
    id: KNOWN_IDS["Cyborg Bear"],
    ingredients: {
      Gold: 3,
    },
    releaseDate: Date.now(),
    supply: 5,
    tokenId: KNOWN_IDS["Cyborg Bear"],
    price: 3,
  },
];

export const fetchAuctioneerDrops = async (
  token: string,
  transactionId: string
) => {
  const cache = loadCachedItems();

  if (cache) {
    return { id: cache.id, items: cache.items };
  }
  const response = await window.fetch(`${CONFIG.API_URL}/auctioneer`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });
  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.AUCTIONEER_SERVER_ERROR);
  }

  const {
    auctioneer: items,
    id,
  }: {
    auctioneer: AuctioneerItem[];
    id: string;
  } = await response.json();

  cacheItems(id, items);

  return { id, items };
};

export const fetchAuctioneerSupply = (ids: number[]) => {
  return getInventorySupply(wallet.web3Provider, wallet.myAccount, ids);
};
