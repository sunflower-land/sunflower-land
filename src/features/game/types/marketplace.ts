import {
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS, KNOWN_ITEMS } from ".";
import { TRADE_LIMITS } from "../actions/tradeLimits";
import { availableWardrobe } from "../events/landExpansion/equip";
import { BumpkinItem, ITEM_IDS } from "./bumpkin";
import { getKeys } from "./decorations";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { BUMPKIN_WITHDRAWABLES, WITHDRAWABLES } from "./withdrawables";

export type CollectionName =
  | "collectibles"
  | "wearables"
  | "buds"
  | "resources";

export type Tradeable = {
  id: number;
  floor: number;
  supply: number;
  type: "onchain" | "instant";
};

export type Offer = {
  tradeId: string;
  sfl: number;
  quantity: number;
  offeredById: number;
  offeredAt: number;
};

type Listing = {
  sfl: number;
  quantity: number;
  listedById: number;
  listedAt: number;
};

export type TradeableDetails = Tradeable & {
  offers: Offer[];
  listings: Listing[];
  history: { price: number; sales: number; date: string }[];
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
