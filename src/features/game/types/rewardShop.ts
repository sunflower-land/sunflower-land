import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

export type RewardShopItemName =
  | RewardShopCollectibleName
  | RewardShopWearableName;

export type RewardShopCollectibleName = "Basic Bear" | "Bronze Love Box";

export type RewardShopWearableName = "Red Farmer Shirt";

type RewardShopBase = {
  cost: {
    price: number;
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

export const isRewardShopCollectible = (
  name: RewardShopItemName,
): name is RewardShopCollectibleName =>
  REWARD_SHOP_ITEMS[name].type === "collectible";

// Test only
export const REWARD_SHOP_ITEMS: Record<RewardShopItemName, RewardShopItem> = {
  "Red Farmer Shirt": {
    name: "Red Farmer Shirt",
    cost: {
      price: 20,
    },
    type: "wearable",
  },
  "Basic Bear": {
    name: "Basic Bear",
    cost: {
      price: 50,
    },
    type: "collectible",
  },
  "Bronze Love Box": {
    name: "Bronze Love Box",
    cost: {
      price: 100,
    },
    type: "collectible",
  },
};
