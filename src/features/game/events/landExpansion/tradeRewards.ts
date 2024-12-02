import { INITIAL_STOCK } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName, GameState } from "features/game/types/game";
import { SEEDS } from "features/game/types/seeds";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { bait, animalFood } from "features/game/types/withdrawables";

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
});
