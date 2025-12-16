import { BumpkinItem } from "./bumpkin";
import { GameState, InventoryItemName, IslandType } from "./game";
import { KNOWN_ITEMS } from ".";
import { TRADE_LIMITS } from "../actions/tradeLimits";
import { hasVipAccess } from "../lib/vipAccess";
import { isTemporaryCollectibleActive } from "../lib/collectibleBuilt";
import { PetNFTName } from "./pets";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";

// 10% tax on sales
export const MARKETPLACE_TAX = 0.1;

// Give it 15 minutes to resolve (cannot cancel while it is being purchased)
export const TRADE_INITIATION_MS = 15 * 60 * 1000;

export type CollectionName = "collectibles" | "wearables" | "buds" | "pets";

export type Tradeable =
  | {
      id: number;
      floor: number;
      lastSalePrice: number;
      isActive: boolean;
      isVip: boolean;
      supply: number | undefined;
      collection: Exclude<CollectionName, "pets">;
      expiresAt?: number;
    }
  | {
      id: number;
      floor: number;
      lastSalePrice: number;
      isActive: boolean;
      isVip: boolean;
      supply: number | undefined;
      collection: Extract<CollectionName, "pets">;
      expiresAt?: number;
      experience?: number;
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

export type MarketplaceTrends = {
  volume: number;
  trades: number;
  owners: number;
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
  weeklyFlowerSpent: number;
  weeklyFlowerEarned: number;

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
  | BudNFTName
  | PetNFTName;

export type PriceHistory = {
  dates: TradeHistoryDate[];
  sevenDayChange: number;
  sevenDayPrice: number;
  oneDayChange: number;
  oneDayPrice: number;
  oneDayPriceChange: number;
  sevenDayPriceChange: number;
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

  // For any dates that have no price, use the next older *non-zero* date's price.
  // Since array is sorted newest-first, we iterate from oldest -> newest and carry
  // forward the last known non-zero price to avoid propagating zeros.
  let lastNonZeroLow = 0;
  let lastNonZeroHigh = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    if (dates[i].low > 0) {
      lastNonZeroLow = dates[i].low;
      lastNonZeroHigh = dates[i].high;
      continue;
    }

    if (lastNonZeroLow > 0) {
      dates[i].low = lastNonZeroLow;
      dates[i].high = lastNonZeroHigh;
    }
  }

  const currentPrice = price ?? dates[0]?.high ?? 0;

  const sevenDayPrice = dates[6]?.low ?? 0;
  const sevenDayPriceChange = currentPrice - sevenDayPrice;
  const sevenDayChange =
    sevenDayPrice === 0 || sevenDayPriceChange === 0
      ? 0
      : (sevenDayPriceChange / sevenDayPrice) * 100;

  const oneDayPrice = dates[1]?.low ?? 0;
  const oneDayPriceChange = currentPrice - oneDayPrice;
  const oneDayChange =
    oneDayPrice === 0 || oneDayPriceChange === 0
      ? 0
      : (oneDayPriceChange / oneDayPrice) * 100;

  return {
    dates,
    sevenDayChange,
    oneDayChange,
    oneDayPriceChange,
    sevenDayPriceChange,
    oneDayPrice,
    sevenDayPrice,
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

    if (cheapestListing) {
      price = cheapestListing.sfl / cheapestListing.quantity;
    } else {
      price = 0;
    }
  } else if (tradeable?.history.sales.length) {
    // Set it to the latest sale
    price =
      tradeable.history.sales[0].sfl / tradeable.history.sales[0].quantity;
  }

  return price;
}

const ISLAND_RESOURCE_TAXES: Record<IslandType, number> = {
  basic: 1,
  spring: 0.5,
  desert: 0.2,
  volcano: 0.15,
};

export function getResourceTax({ game }: { game: GameState }) {
  let tax = new Decimal(ISLAND_RESOURCE_TAXES[game.island.type]);

  if (hasVipAccess({ game })) {
    tax = tax.mul(0.5);
  }

  if (isTemporaryCollectibleActive({ name: "Trading Shrine", game })) {
    tax = tax.sub(0.025);
  }

  return setPrecision(tax, 4);
}
