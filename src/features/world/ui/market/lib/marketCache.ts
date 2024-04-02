import { MarketPrices } from "features/game/actions/getMarketPrices";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `market-prices.${host}-${window.location.pathname}`;

export const getCachedMarketPrices = ():
  | { prices: MarketPrices; cachedAt: number }
  | undefined => {
  const marketPrices = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!marketPrices) return undefined;

  try {
    return JSON.parse(marketPrices);
  } catch (e) {
    return undefined;
  }
};

export const setCachedMarketPrices = (marketPrices: MarketPrices) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ prices: marketPrices, cachedAt: Date.now() })
  );
};
