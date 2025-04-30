import { BumpkinItem } from "./bumpkin";
import { GameState, InventoryItemName } from "./game";
import { KNOWN_ITEMS } from ".";
import { TRADE_LIMITS } from "../actions/tradeLimits";

// 10% tax on sales
export const MARKETPLACE_TAX = 0.1;

// Give it 15 minutes to resolve (cannot cancel while it is being purchased)
export const TRADE_INITIATION_MS = 15 * 60 * 1000;

export type CollectionName =
  | "collectibles"
  | "wearables"
  | "buds"
  | "resources";

export type Tradeable = {
  id: number;
  floor: number;
  lastSalePrice: number;
  supply: number;
  collection: CollectionName;
  isActive: boolean;
  expiresAt?: number;
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
  itemId: number;
  collection: CollectionName;
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

export type BudNFTName = `Bud #${number}`;

export type MarketplaceTradeableName =
  | InventoryItemName
  | BumpkinItem
  | BudNFTName;

export type PriceHistory = {
  dates: TradeHistoryDate[];
  sevenDayChange: number;
  sevenDayPrice: number;
  oneDayChange: number;
  oneDayPrice: number;
  thirtyDayChange: number;
  thirtyDayPrice: number;
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

  const sevenDayPrice = dates[6].low;
  const sevenDayPriceChange = currentPrice - sevenDayPrice;
  const sevenDayChange =
    sevenDayPriceChange === 0 ? 0 : (sevenDayPriceChange / sevenDayPrice) * 100;

  const oneDayPrice = dates[1].low;
  const oneDayPriceChange = currentPrice - oneDayPrice;
  const oneDayChange =
    oneDayPriceChange === 0 ? 0 : (oneDayPriceChange / oneDayPrice) * 100;

  const thirtyDayPrice = dates[29].low;
  const thirtyDayPriceChange = currentPrice - dates[29].low;
  const thirtyDayChange =
    thirtyDayPriceChange === 0
      ? 0
      : (thirtyDayPriceChange / thirtyDayPrice) * 100;

  return {
    dates,
    sevenDayChange,
    oneDayChange,
    thirtyDayChange,
    oneDayPriceChange,
    sevenDayPriceChange,
    thirtyDayPriceChange,
    oneDayPrice,
    sevenDayPrice,
    thirtyDayPrice,
  };
}

/**
 * What is the market price of an item
 * For resources, it is the cheapest listing (floor price)
 * For others, it is the latest sale
 */
export function getMarketPrice({
  tradeable,
}: {
  tradeable?: TradeableDetails;
}) {
  if (!tradeable) {
    return 0;
  }

  let price = 0;

  const isResource =
    tradeable?.collection === "collectibles" &&
    KNOWN_ITEMS[tradeable.id] in TRADE_LIMITS;

  // If a resource, set the price to the floor
  if (isResource && tradeable.listings?.length > 0) {
    const cheapestListing = tradeable.listings.reduce((cheapest, listing) => {
      return listing.sfl < cheapest.sfl ? listing : cheapest;
    }, tradeable.listings[0]);

    price = cheapestListing?.sfl ?? 0;
  } else if (tradeable?.history.sales.length) {
    // Set it to the latest sale
    price =
      tradeable.history.sales[0].sfl / tradeable.history.sales[0].quantity;
  }

  return price;
}
