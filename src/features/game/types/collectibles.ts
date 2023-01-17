import Decimal from "decimal.js-light";
import { Inventory } from "./game";

export type HeliosBlacksmithItem = "Immortal Pear";

export type GoblinBlacksmithItemName =
  | "Lady Bug"
  | "Squirrel Monkey"
  | "Black Bearry"
  | "Maneki Neko";

export type CraftableCollectible = {
  ingredients: Inventory;
  description: string;
  boost?: string;
};

export const HELIOS_BLACKSMITH_ITEMS: Record<
  HeliosBlacksmithItem,
  CraftableCollectible
> = {
  "Immortal Pear": {
    description: "A long-lived pear that makes fruit trees last longer.",
    ingredients: {
      Gold: new Decimal(5),
      Apple: new Decimal(10),
      Blueberry: new Decimal(10),
      Orange: new Decimal(10),
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
    supply: 2535,
    boost: "+0.25 Apples",
  },
  "Squirrel Monkey": {
    description:
      "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
    ingredients: {
      Gold: new Decimal(25),
      Orange: new Decimal(300),
    },
    supply: 1035,
    boost: "1/2 Orange Tree grow time",
  },
  "Black Bearry": {
    description:
      "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
    ingredients: {
      Gold: new Decimal(25),
      Blueberry: new Decimal(700),
    },
    supply: 535,
    boost: "+1 Blueberry",
  },
  "Maneki Neko": {
    description: "The beckoning cat. Pull it's arm and good luck will come",
    ingredients: {
      Gold: new Decimal(5),
      "Red Envelope": new Decimal(50),
    },
    supply: 30000,
    disabled: true,
  },
};
