import Decimal from "decimal.js-light";
import { Inventory } from "./game";

export type HeliosBlacksmithItem = "Immortal Pear";

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
    description:
      "This long-lived pear ensures your fruit tree survives +1 bonus harvest.",
    ingredients: {
      Gold: new Decimal(25),
    },
    boost: "Fruit lasts +1 harvest",
  },
};
