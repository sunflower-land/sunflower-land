import Decimal from "decimal.js-light";
import { Inventory } from "./game";
import { PET_SHRINES, PetShrineName } from "./pets";

export type PetShopItemName = "Pet Egg" | "Obsidian Shrine" | PetShrineName;

type PetShop = {
  ingredients: Inventory;
  description: string;
  coins?: number;
  name: PetShopItemName;
  level?: number;
};

export const PET_SHOP_ITEMS: Record<PetShopItemName, PetShop> = {
  "Pet Egg": {
    name: "Pet Egg",
    description: "A pet egg",
    coins: 30000,
    ingredients: {},
  },
  "Obsidian Shrine": {
    name: "Obsidian Shrine",
    description: "A shrine to the Obsidian God",
    ingredients: {
      Obsidian: new Decimal(1),
    },
  },
  ...PET_SHRINES,
};
