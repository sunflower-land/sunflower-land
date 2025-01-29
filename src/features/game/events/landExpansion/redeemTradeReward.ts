import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName, GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type TradeRewardsItem =
  | Extract<
      InventoryItemName,
      "Treasure Key" | "Rare Key" | "Luxury Key" | "Prize Ticket"
    >
  | TradeFood;

export type TradeRewardPacks =
  | "Tool Pack"
  | "Seed Pack"
  | "Fishing Pack"
  | "Animal Feed Pack"
  | "Digging Pack";

export type TradeFood = "Trade Cake";

export type TradeReward = {
  name: TradeRewardsItem | TradeRewardPacks;
  items: Partial<Record<InventoryItemName, number>>;
  ingredients: Record<Extract<InventoryItemName, "Trade Point">, number>;
  image: string;
  description: string;
};

export const TRADE_REWARDS_PACKS: Record<TradeRewardPacks, TradeReward> = {
  "Tool Pack": {
    name: "Tool Pack",
    items: {
      Axe: 200,
      Pickaxe: 60,
      "Stone Pickaxe": 20,
      "Iron Pickaxe": 5,
      "Gold Pickaxe": 5,
    },
    ingredients: {
      "Trade Point": 7500,
    },
    image: SUNNYSIDE.tools.wood_pickaxe,
    description: translate("marketplace.reward.toolPack.description"),
  },
  "Digging Pack": {
    name: "Digging Pack",
    items: {
      "Sand Shovel": 50,
      "Sand Drill": 10,
    },
    ingredients: {
      "Trade Point": 3500,
    },
    image: SUNNYSIDE.tools.sand_shovel,
    description: translate("marketplace.reward.diggingPack.description"),
  },
  "Seed Pack": {
    name: "Seed Pack",
    items: {
      "Sunflower Seed": 400,
      "Potato Seed": 200,
      "Pumpkin Seed": 150,
      "Carrot Seed": 100,
      "Cabbage Seed": 90,
      "Soybean Seed": 90,
      "Beetroot Seed": 80,
      "Cauliflower Seed": 80,
      "Parsnip Seed": 60,
      "Eggplant Seed": 50,
      "Corn Seed": 50,
      "Radish Seed": 40,
      "Wheat Seed": 40,
      "Kale Seed": 30,
      "Barley Seed": 30,

      "Tomato Seed": 10,
      "Blueberry Seed": 10,
      "Orange Seed": 10,
      "Apple Seed": 10,
      "Banana Plant": 10,
      "Lemon Seed": 10,
    },
    ingredients: {
      "Trade Point": 1500,
    },
    image: CROP_LIFECYCLE.basic.Sunflower.seed,
    description: translate("marketplace.reward.seedPack.description"),
  },
  "Fishing Pack": {
    name: "Fishing Pack",
    items: {
      Rod: 50,
      Earthworm: 10,
      Grub: 10,
      "Red Wiggler": 10,
    },
    ingredients: {
      "Trade Point": 750,
    },
    image: SUNNYSIDE.icons.fish,
    description: translate("marketplace.reward.fishingPack.description"),
  },
  "Animal Feed Pack": {
    name: "Animal Feed Pack",
    items: {
      "Kernel Blend": 25,
      Hay: 25,
      NutriBarley: 25,
      "Mixed Grain": 25,
    },
    ingredients: {
      "Trade Point": 700,
    },
    image: ITEM_DETAILS["Mixed Grain"].image,
    description: translate("marketplace.reward.animalPack.description"),
  },
};

export const TRADE_REWARDS_ITEMS: Record<TradeRewardsItem, TradeReward> = {
  "Treasure Key": {
    name: "Treasure Key",
    items: {
      "Treasure Key": 1,
    },
    ingredients: {
      "Trade Point": 1200,
    },
    image: ITEM_DETAILS["Treasure Key"].image,
    description: ITEM_DETAILS["Treasure Key"].description,
  },
  "Rare Key": {
    name: "Rare Key",
    items: {
      "Rare Key": 1,
    },
    ingredients: {
      "Trade Point": 3600,
    },
    image: ITEM_DETAILS["Rare Key"].image,
    description: ITEM_DETAILS["Rare Key"].description,
  },
  "Luxury Key": {
    name: "Luxury Key",
    items: {
      "Luxury Key": 1,
    },
    ingredients: {
      "Trade Point": 6000,
    },
    image: ITEM_DETAILS["Luxury Key"].image,
    description: ITEM_DETAILS["Luxury Key"].description,
  },
  "Prize Ticket": {
    name: "Prize Ticket",
    items: {
      "Prize Ticket": 1,
    },
    ingredients: {
      "Trade Point": 20000,
    },
    image: ITEM_DETAILS["Prize Ticket"].image,
    description: ITEM_DETAILS["Prize Ticket"].description,
  },
  "Trade Cake": {
    name: "Trade Cake",
    items: {
      "Trade Cake": 1,
    },
    ingredients: {
      "Trade Point": 3000,
    },
    image: ITEM_DETAILS["Trade Cake"].image,
    description: ITEM_DETAILS["Trade Cake"].description,
  },
};

export const TRADE_REWARDS: Record<
  TradeRewardsItem | TradeRewardPacks,
  TradeReward
> = {
  ...TRADE_REWARDS_PACKS,
  ...TRADE_REWARDS_ITEMS,
};

export type RedeemTradeRewardsAction = {
  type: "reward.redeemed";
  item: TradeRewardsItem | TradeRewardPacks;
};

type Options = {
  state: Readonly<GameState>;
  action: RedeemTradeRewardsAction;
};

export function redeemTradeReward({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const tradePoint = game.inventory["Trade Point"] ?? new Decimal(0);
    const { item } = action;
    const { ingredients, items } = TRADE_REWARDS[item];
    const tradePointCost = ingredients["Trade Point"];

    if (tradePoint.lt(tradePointCost)) {
      throw new Error("You do not have enough Trade Points!");
    }

    getKeys(items).forEach((name) => {
      const inventoryAmount = game.inventory[name] ?? new Decimal(0);
      const inventoryLimit = INVENTORY_LIMIT(game)[name];
      const packAmount = items[name] ?? 0;

      // Checks if buying the pack will exceed Inventory Limit for Seeds and Tools
      if (!!inventoryLimit && inventoryAmount.gte(inventoryLimit)) {
        throw new Error("Inventory Limit Reached!");
      }

      // Adds item into inventory
      game.inventory[name] = inventoryAmount.add(packAmount);
    });

    // Deducts Trade Points from inventory
    game.inventory["Trade Point"] = tradePoint.sub(tradePointCost);
    return game;
  });
}
