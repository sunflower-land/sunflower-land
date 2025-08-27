import Decimal from "decimal.js-light";
import { PET_SHRINES, PetShrineName } from "./pets";
import { CraftableCollectible } from "./collectibles";

export type PetShopItemName = "Pet Egg" | "Obsidian Shrine" | PetShrineName;

export const PET_SHOP_ITEMS: Record<PetShopItemName, CraftableCollectible> = {
  "Pet Egg": {
    description: "A pet egg",
    coins: 30000,
    ingredients: {},
  },
  "Obsidian Shrine": {
    description: "A shrine to the Obsidian God",
    ingredients: {
      Obsidian: new Decimal(1),
    },
  },
  ...PET_SHRINES,
};
