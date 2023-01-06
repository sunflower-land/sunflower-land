import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { Inventory } from "./game";

export type HeliosBlacksmithItem = "Immortal Pear";

export type GoblinBlacksmithItemName =
  | "Lady Bug"
  | "Squirrel Monkey"
  | "Black Bearry";

export type CraftableCollectible = {
  ingredients: Inventory;
  description: string;
  boost: string;
};

export const HELIOS_BLACKSMITH_ITEMS: Record<
  HeliosBlacksmithItem,
  CraftableCollectible
> = {
  "Immortal Pear": {
    description: "A long-lived pear that makes fruit trees last longer.",
    ingredients: {
      Gold: new Decimal(25),
    },
    boost: "+1 harvest",
  },
};

export type GoblinBlacksmithCraftable = CraftableCollectible & {
  supply: number;
  disabled?: boolean;
};

export const GOBLIN_BLACKSMITH_ITEMS: Record<
  GoblinBlacksmithItemName,
  GoblinBlacksmithCraftable
> = {
  "Lady Bug": {
    description:
      "An incredible bug that feeds on aphids. Improves Apple quality.",
    ingredients: {
      Gold: new Decimal(25),
      Apple: new Decimal(100),
    },
    supply: 2500,
    boost: "+0.25 Apples",
    disabled: CONFIG.NETWORK === "mainnet",
  },
  "Squirrel Monkey": {
    description:
      "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
    ingredients: {
      Gold: new Decimal(25),
      Orange: new Decimal(300),
    },
    supply: 1000,
    boost: "1/2 Orange Tree grow time",
    disabled: CONFIG.NETWORK === "mainnet",
  },
  "Black Bearry": {
    description:
      "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
    ingredients: {
      Gold: new Decimal(25),
      Blueberry: new Decimal(700),
    },
    supply: 500,
    boost: "+1 Blueberry",
    disabled: CONFIG.NETWORK === "mainnet",
  },
};
