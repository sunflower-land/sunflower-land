/**
 * Legacy tool settings can be found in craftables.ts
 */

import Decimal from "decimal.js-light";
import { Inventory, IslandType, LoveAnimalItem, Skills } from "./game";
import { translate } from "lib/i18n/translate";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Gold Pickaxe"
  | "Rod"
  | "Oil Drill"
  | "Pest Net";

export type TreasureToolName = "Sand Shovel" | "Sand Drill";

export interface Tool {
  name: string;
  description: string;
  ingredients: (skills?: Skills) => Inventory;
  price: number;
  disabled?: boolean;
  requiredIsland?: IslandType;
}

export const WORKBENCH_TOOLS: Record<
  WorkbenchToolName,
  Tool & { stock: Decimal }
> = {
  Axe: {
    name: "Axe",
    description: translate("description.axe"),
    price: 20,
    ingredients: () => ({}),
    stock: new Decimal(200),
  },
  Pickaxe: {
    name: "Pickaxe",
    description: translate("description.pickaxe"),
    price: 20,
    ingredients: () => ({
      Wood: new Decimal(3),
    }),
    stock: new Decimal(60),
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: translate("description.stone.pickaxe"),
    price: 20,
    ingredients: () => ({
      Wood: new Decimal(3),
      Stone: new Decimal(5),
    }),
    stock: new Decimal(20),
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: translate("description.iron.pickaxe"),

    price: 80,
    ingredients: () => ({
      Wood: new Decimal(3),
      Iron: new Decimal(5),
    }),
    stock: new Decimal(5),
  },
  "Gold Pickaxe": {
    name: "Gold Pickaxe",
    description: translate("description.gold.pickaxe"),
    price: 100,
    ingredients: () => ({
      Wood: new Decimal(3),
      Gold: new Decimal(3),
    }),
    stock: new Decimal(5),
  },
  Rod: {
    name: "Rod",
    description: translate("description.rod"),
    price: 20,
    ingredients: () => ({
      Wood: new Decimal(3),
      Stone: new Decimal(1),
    }),
    stock: new Decimal(50),
  },
  "Oil Drill": {
    name: "Oil Drill",
    description: translate("description.oil.drill"),
    price: 100,
    ingredients: (skill) => {
      if (skill?.["Oil Rig"]) {
        return {
          Wood: new Decimal(20),
          Iron: new Decimal(9),
          Wool: new Decimal(20),
        };
      }

      return {
        Wood: new Decimal(20),
        Iron: new Decimal(9),
        Leather: new Decimal(10),
      };
    },
    requiredIsland: "desert",
    stock: new Decimal(5),
  },
  "Pest Net": {
    name: "Pest Net",
    description: translate("description.pestNet"),
    price: 50,
    ingredients: () => ({
      Wool: new Decimal(2),
    }),
    stock: new Decimal(10),
    disabled: true,
  },
};

export const TREASURE_TOOLS: Record<TreasureToolName, Tool> = {
  "Sand Shovel": {
    name: "Sand Shovel",
    description: translate("description.sand.shovel"),
    price: 20,
    ingredients: () => ({
      Wood: new Decimal(2),
      Stone: new Decimal(1),
    }),
  },
  "Sand Drill": {
    name: "Sand Drill",
    description: translate("description.sand.drill"),
    price: 40,
    ingredients: () => ({
      Oil: new Decimal(1),
      Crimstone: new Decimal(1),
      Wood: new Decimal(3),
      Leather: new Decimal(1),
    }),
  },
};

export const LOVE_ANIMAL_TOOLS: Record<LoveAnimalItem, Tool> = {
  "Petting Hand": {
    name: "Petting Hand",
    description: translate("description.petting.hand"),
    price: 0,
    ingredients: () => ({}),
  },
  Brush: {
    name: "Brush",
    description: translate("description.brush"),
    price: 2000,
    ingredients: () => ({}),
  },
  "Music Box": {
    name: "Music Box",
    description: translate("description.music.box"),
    price: 50000,
    ingredients: () => ({}),
  },
};
