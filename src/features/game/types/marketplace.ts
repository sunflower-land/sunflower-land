import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

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

export type TradeableDetails = Tradeable & {
  offers: Offer[];
  listings: Listing[];
  history: PriceHistory[];
};

export type Collection = {
  type: CollectionName;
  items: Tradeable[];
};

type BudNFTName = `Bud #${number}`;

export type MarketplaceTradeableName =
  | InventoryItemName
  | BumpkinItem
  | BudNFTName;
