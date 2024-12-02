import Decimal from "decimal.js-light";
import { INITIAL_STOCK, INVENTORY_LIMIT } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName, GameState } from "features/game/types/game";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { bait, animalFood } from "features/game/types/withdrawables";
import { produce } from "immer";

export type TradeRewardsItem =
  | Extract<
      InventoryItemName,
      "Treasure Key" | "Rare Key" | "Luxury Key" | "Prize Ticket"
    >
  | TradeRewardPacks;

type TradeRewardPacks =
  | "Tool Pack"
  | "Seed Pack"
  | "Fishing Pack"
  | "Animal Pack";

type TradeReward = {
  name: TradeRewardsItem;
  items: Partial<Record<InventoryItemName, number>>;
  ingredients: Record<Extract<InventoryItemName, "Trade Point">, number>;
};

export const TRADE_REWARDS: (
  state: GameState,
) => Record<TradeRewardsItem, TradeReward> = (state) => ({
  "Treasure Key": {
    name: "Treasure Key",
    items: {
      "Treasure Key": 1,
    },
    ingredients: {
      "Trade Point": 50,
    },
  },
  "Rare Key": {
    name: "Rare Key",
    items: {
      "Rare Key": 1,
    },
    ingredients: {
      "Trade Point": 250,
    },
  },
  "Luxury Key": {
    name: "Luxury Key",
    items: {
      "Luxury Key": 1,
    },
    ingredients: {
      "Trade Point": 1000,
    },
  },
  "Prize Ticket": {
    name: "Prize Ticket",
    items: {
      "Prize Ticket": 1,
    },
    ingredients: {
      "Trade Point": 1500,
    },
  },
  "Tool Pack": {
    name: "Tool Pack",
    items: getKeys(WORKBENCH_TOOLS).reduce(
      (acc, name) => {
        return {
          ...acc,
          // Rods are given in another pack
          [name]: name === "Rod" ? 0 : INITIAL_STOCK(state)[name].toNumber(),
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ), // Gets the amount of tools to give out based on the amounts in INITIAL_STOCK
    ingredients: {
      "Trade Point": 250,
    },
  },
  "Seed Pack": {
    name: "Seed Pack",
    items: getKeys(SEEDS()).reduce(
      (acc, name) => {
        return {
          ...acc,
          [name]: INITIAL_STOCK(state)[name].toNumber(),
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 500,
    },
  },
  "Fishing Pack": {
    name: "Fishing Pack",
    items: {
      Rod: INITIAL_STOCK(state).Rod.toNumber(),
      ...getKeys(bait).reduce(
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
      "Trade Point": 50,
    },
  },
  "Animal Pack": {
    name: "Animal Pack",
    items: getKeys(animalFood).reduce(
      (acc, feed) => {
        return {
          ...acc,
          [feed]: feed === "Omnifeed" ? 0 : 25,
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 50,
    },
  },
  "Digging Pack": {
    name: "Digging Pack",
    items: getKeys(TREASURE_TOOLS).reduce(
      (acc, tool) => {
        return {
          ...acc,
          [tool]: INITIAL_STOCK(state)[tool],
        };
      },
      {} as Partial<Record<InventoryItemName, number>>,
    ),
    ingredients: {
      "Trade Point": 50,
    },
  },
});

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
    const { ingredients, items } = TRADE_REWARDS(game)[item];
    const tradePointCost = ingredients["Trade Point"];

    if (tradePoint.lt(tradePointCost)) {
      throw new Error("You do not have enough Trade Points!");
    }

    getKeys(items).forEach((name) => {
      const inventoryAmount = game.inventory[name] ?? new Decimal(0);
      const inventoryLimit = INVENTORY_LIMIT(game)[name];
      const packAmount = items[name] ?? 0;

      // Checks if buying the pack will exceed Inventory Limit for Seeds and Tools
      if (
        !!inventoryLimit &&
        inventoryAmount.add(packAmount).gt(inventoryLimit)
      ) {
        throw new Error("Inventory Limit Reached!");
      }

      // Adds item into inventory
      if (!game.inventory[name]) {
        game.inventory[name] = new Decimal(packAmount);
      } else {
        game.inventory[name] = game.inventory[name].add(packAmount);
      }
    });

    // Deducts Trade Points from inventory
    game.inventory["Trade Point"] = tradePoint.sub(tradePointCost);
    return game;
  });
}
