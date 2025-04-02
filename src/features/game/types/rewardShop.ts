import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import Decimal from "decimal.js-light";

export type RewardShopItemName =
  | RewardShopCollectibleName
  | RewardShopWearableName;

export type RewardShopCollectibleName = "Basic Bear" | "Treasure Key";

export type RewardShopWearableName = "Red Farmer Shirt";

type RewardShopBase = {
  cost: {
    items: Partial<Record<InventoryItemName, number>>;
    price: Decimal;
  };
  type: "wearable" | "collectible";
};

export type RewardShopWearable = RewardShopBase & {
  name: BumpkinItem;
};
export type RewardShopCollectible = RewardShopBase & {
  name: InventoryItemName;
};

export type RewardShopItem = RewardShopWearable | RewardShopCollectible;

// Test only
export const REWARD_SHOP_ITEMS: Record<RewardShopItemName, RewardShopItem> = {
  "Red Farmer Shirt": {
    name: "Red Farmer Shirt",
    cost: {
      items: {},
      price: new Decimal(20),
    },
    type: "wearable",
  },
  "Basic Bear": {
    name: "Basic Bear",
    cost: {
      items: {},
      price: new Decimal(50),
    },
    type: "collectible",
  },
  "Treasure Key": {
    name: "Treasure Key",
    cost: {
      items: {},
      price: new Decimal(100),
    },
    type: "collectible",
  },
};
