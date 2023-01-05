import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { Inventory } from "./game";

export type HeliosBlacksmithItem = "Immortal Pear";

export type GoblinBlacksmithItemName = "Lady Bug";

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
};
