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
    description: "A long-lived pear that makes fruit trees last longer.",
    ingredients: {
      Gold: new Decimal(25),
    },
    boost: "+1 harvest",
  },
};
