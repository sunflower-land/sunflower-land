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

export type PriceHistory = {
  date: string;
  volume: number;
  sales: number;
  price: number;
};

export type SaleHistory = {
  totalSales: number;
  oneDayPrice: number;
  sevenDayPrice: number;
  thirtyDayPrice: number;
  latestPrice: number;
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
  price: number;
  sevenDayPrice: number;
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
