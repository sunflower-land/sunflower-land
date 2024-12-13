import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { INITIAL_STOCK, INVENTORY_LIMIT } from "features/game/lib/constants";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { getKeys } from "features/game/types/decorations";
import { BAIT } from "features/game/types/fishing";
import { InventoryItemName, GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type TradeRewardsItem =
  | Extract<
      InventoryItemName,
      "Treasure Key" | "Rare Key" | "Luxury Key" | "Prize Ticket"
    >
  | TradeRewardPacks
  | TradeFood;

type TradeRewardPacks =
  | "Tool Pack"
  | "Seed Pack"
  | "Fishing Pack"
  | "Animal Pack"
  | "Digging Pack";

export type TradeFood = "Trade Cake";

export type TradeReward = {
  name: TradeRewardsItem;
  items: Partial<Record<InventoryItemName, number>>;
  ingredients: Record<Extract<InventoryItemName, "Trade Point">, number>;
  image: string;
  description: string;
};

export const TRADE_REWARDS: Record<TradeRewardsItem, TradeReward> = {
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
  "Tool Pack": {
    name: "Tool Pack",
    items: getKeys(WORKBENCH_TOOLS).reduce(
      (acc, name) => {
        return {
          ...acc,
          // Rods are given in another pack
          [name]: name === "Rod" ? 0 : INITIAL_STOCK()[name].toNumber(),
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ), // Gets the amount of tools to give out based on the amounts in INITIAL_STOCK
    ingredients: {
      "Trade Point": 7500,
    },
    image: SUNNYSIDE.tools.wood_pickaxe,
    description: translate("marketplace.reward.toolPack.description"),
  },
  "Digging Pack": {
    name: "Digging Pack",
    items: getKeys(TREASURE_TOOLS).reduce(
      (acc, tool) => {
        return {
          ...acc,
          [tool]: INITIAL_STOCK()[tool],
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 3500,
    },
    image: SUNNYSIDE.tools.sand_shovel,
    description: translate("marketplace.reward.diggingPack.description"),
  },
  "Seed Pack": {
    name: "Seed Pack",
    items: getKeys(SEEDS()).reduce(
      (acc, name) => {
        return {
          ...acc,
          [name]: INITIAL_STOCK()[name].toNumber(),
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 3000,
    },
    image: CROP_LIFECYCLE.Sunflower.seed,
    description: translate("marketplace.reward.seedPack.description"),
  },
  "Fishing Pack": {
    name: "Fishing Pack",
    items: {
      Rod: INITIAL_STOCK().Rod.toNumber(),
      ...getKeys(BAIT).reduce(
        (acc, bait) => {
          return {
            ...acc,
            [bait]: bait === "Fishing Lure" ? 0 : 10,
          };
        },
        {} as Partial<Record<InventoryItemName, number>>,
      ),
    },
    ingredients: {
      "Trade Point": 750,
    },
    image: SUNNYSIDE.icons.fish,
    description: translate("marketplace.reward.fishingPack.description"),
  },
  "Animal Pack": {
    name: "Animal Pack",
    items: getKeys(ANIMAL_FOODS).reduce(
      (acc, feed) => {
        return {
          ...acc,
          [feed]: feed === "Omnifeed" ? 0 : 25,
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 700,
    },
    image: ITEM_DETAILS["Mixed Grain"].image,
    description: translate("marketplace.reward.animalPack.description"),
  },
};

export type RedeemTradeRewardsAction = {
  type: "reward.redeemed";
  item: TradeRewardsItem;
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
