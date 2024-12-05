import { CONFIG } from "lib/config";
import { BumpkinItem } from "./bumpkin";
import { GameState, InventoryItemName } from "./game";

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
  offeredBy: {
    id: number;
    username: string;
    bumpkinUri: string;
  };
  type: "onchain" | "instant";
};

export type Listing = {
  id: string;
  sfl: number;
  quantity: number;
  listedById: number;
  listedAt: number;
  type: "onchain" | "instant";
  listedBy: {
    id: number;
    username: string;
    bumpkinUri: string;
  };
};

type TradeHistoryDate = {
  date: string;
  low: number;
  high: number;
  volume: number;
  sales: number;
};

export type TradeHistory = {
  totalSales: number;
  totalVolume: number;
  dates: Record<string, TradeHistoryDate>;
};

export type Sale = {
  id: string;
  sfl: number;
  quantity: number;
  fulfilledAt: number;
  fulfilledBy: {
    id: number;
    username?: string;
    bumpkinUri: string;
  };
  initiatedBy: {
    id: number;
    username?: string;
    bumpkinUri: string;
  };
  source: "offer" | "listing";
};

export type SaleHistory = {
  history: TradeHistory;
  sales: Sale[];
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
  topTrades: {
    buyer: {
      id: number;
      username?: string;
      bumpkinUri: string;
    };
    sfl: number;
    itemId: number;
    quantity: number;
    collection: CollectionName;
  }[];
};

export type MarketplaceProfile = {
  id: number;
  username: string;
  level: number;
  tokenUri: string;
  totalTrades: number;
  profit: number;

  listings: GameState["trades"]["listings"];
  offers: GameState["trades"]["offers"];

  friends: {
    id: number;
    tokenUri: string;
    username: string;
    trades: number;
  }[];

  trades: Sale[];
};

type BudNFTName = `Bud #${number}`;

export type MarketplaceTradeableName =
  | InventoryItemName
  | BumpkinItem
  | BudNFTName;

export type PriceHistory = {
  dates: TradeHistoryDate[];
  sevenDayChange: number;
  oneDayChange: number;
  thirtyDayChange: number;
  oneDayPriceChange: number;
  sevenDayPriceChange: number;
  thirtyDayPriceChange: number;
};

/**
 * Fills in missing dates and carries forward the last known price
 */
export function getPriceHistory({
  history,
  from,
  price,
}: {
  history: TradeHistory;
  from: number;
  price?: number;
}): PriceHistory {
  const dates: TradeHistoryDate[] = [];
  let lastKnownPrice = 0;

  // Create a date iterator starting from 'from' until today
  const startDate = new Date(from);
  const today = new Date();

  for (let date = startDate; date <= today; date.setDate(date.getDate() + 1)) {
    const dateKey = date.toISOString().split("T")[0];

    // Find matching history entry for this date
    const dailyData = history.dates[dateKey];

    if (dailyData) {
      lastKnownPrice = dailyData.low;
      dates.push(dailyData);
    } else {
      // Add an entry with 0 volume/sales but carry forward the last price
      dates.push({
        date: dateKey,
        low: lastKnownPrice,
        high: lastKnownPrice,
        volume: 0,
        sales: 0,
      });
    }
  }

  // Sort by most recent date first
  dates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // For any dates that have no price, use the previous date's price
  for (let i = 1; i < dates.length; i++) {
    if (dates[i].low === 0) {
      dates[i].low = dates[i - 1].low;
      dates[i].high = dates[i - 1].high;
    }
  }

  const currentPrice = price ?? dates[0].high;

  const sevenDayPriceChange = currentPrice - dates[6].low;
  const sevenDayChange =
    sevenDayPriceChange === 0 ? 0 : (sevenDayPriceChange / dates[6].low) * 100;

  const oneDayPriceChange = currentPrice - dates[1].low;
  const oneDayChange =
    oneDayPriceChange === 0 ? 0 : (oneDayPriceChange / dates[1].low) * 100;

  const thirtyDayPriceChange = currentPrice - dates[29].low;
  const thirtyDayChange =
    thirtyDayPriceChange === 0
      ? 0
      : (thirtyDayPriceChange / dates[29].low) * 100;

  return {
    dates,
    sevenDayChange,
    oneDayChange,
    thirtyDayChange,
    oneDayPriceChange,
    sevenDayPriceChange,
    thirtyDayPriceChange,
  };
}
