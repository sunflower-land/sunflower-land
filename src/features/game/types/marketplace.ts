import { CONFIG } from "lib/config";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

// 1% tax on mainnet for testing
// 10% tax on sales
export const MARKETPLACE_TAX = CONFIG.NETWORK === "mainnet" ? 0.01 : 0.1;

export type CollectionName =
  | "collectibles"
  | "wearables"
  | "buds"
  | "resources";

export type Tradeable = {
  id: number;
  floor: number;
  supply: number;
  collection: CollectionName;
};

export type Offer = {
  tradeId: string;
  sfl: number;
  quantity: number;
  offeredById: number;
  offeredAt: number;
  type: "onchain" | "instant";
};

export type Listing = {
  id: string;
  sfl: number;
  quantity: number;
  listedById: number;
  listedAt: number;
  type: "onchain" | "instant";
};

export type TradeHistory = {
  totalSales: number;
  totalVolume: number;
  dates: {
    date: string;
    price: number;
    volume: number;
    sales: number;
  }[];
};

export type SaleHistory = {
  history: TradeHistory;
  sales: {
    id: string;
    sfl: number;
    quantity: number;
    fulfilledAt: number;
    fulfilledBy: {
      id: number;
      bumpkinUri: string;
      username?: string;
    };
  }[];
};

export type TradeableDetails = Tradeable & {
  offers: Offer[];
  listings: Listing[];
  history: SaleHistory;
};

export type Marketplace = {
  items: Tradeable[];
};

type TrendingItem = {
  id: number;
  collection: CollectionName;
  history: TradeHistory;
};

export type MarketplaceTrends = {
  volume: number;
  trades: number;
  owners: number;
  items: TrendingItem[];
};

type BudNFTName = `Bud #${number}`;

export type MarketplaceTradeableName =
  | InventoryItemName
  | BumpkinItem
  | BudNFTName;

/**
 * Fills in missing dates and carries forward the last known price
 */
export function getPriceHistory({
  history,
  from,
}: {
  history: TradeHistory;
  from: number;
}): TradeHistory["dates"] {
  const dates: TradeHistory["dates"] = [];
  let lastKnownPrice = 0;

  // Create a date iterator starting from 'from' until today
  const startDate = new Date(from);
  const today = new Date();

  for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
    const dateKey = date.toISOString().split("T")[0];

    // Find matching history entry for this date
    const dailyData = history.dates.find((d) => d.date === dateKey);

    if (dailyData) {
      lastKnownPrice = dailyData.price;
      dates.push(dailyData);
    } else {
      // Add an entry with 0 volume/sales but carry forward the last price
      dates.push({
        date: dateKey,
        price: lastKnownPrice,
        volume: 0,
        sales: 0,
      });
    }
  }

  // Sort by most recent date first
  dates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return dates;
}
