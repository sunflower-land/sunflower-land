/**
 * Legacy tool settings can be found in craftables.ts
 */

import Decimal from "decimal.js-light";
import { Inventory, IslandType } from "./game";
import { translate } from "lib/i18n/translate";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Gold Pickaxe"
  | "Rod"
  | "Oil Drill";

export type TreasureToolName = "Sand Shovel" | "Sand Drill";

export interface Tool {
  name: string;
  description: string;
  ingredients: Inventory;
  price: number;
  disabled?: boolean;
  requiredIsland?: IslandType;
}

export const WORKBENCH_TOOLS: Record<WorkbenchToolName, Tool> = {
  Axe: {
    name: "Axe",
    description: translate("description.axe"),
    price: 20,
    ingredients: {},
  },
  Pickaxe: {
    name: "Pickaxe",
    description: translate("description.pickaxe"),
    price: 20,
    ingredients: {
      Wood: new Decimal(3),
    },
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: translate("description.stone.pickaxe"),
    price: 20,
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(5),
    },
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: translate("description.iron.pickaxe"),

    price: 80,
    ingredients: {
      Wood: new Decimal(3),
      Iron: new Decimal(5),
    },
  },
  "Gold Pickaxe": {
    name: "Gold Pickaxe",
    description: translate("description.gold.pickaxe"),
    price: 100,
    ingredients: {
      Wood: new Decimal(3),
      Gold: new Decimal(3),
    },
  },
  Rod: {
    name: "Rod",
    description: translate("description.rod"),
    price: 20,
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(1),
    },
  },
  "Oil Drill": {
    name: "Oil Drill",
    description: translate("description.oil.drill"),
    price: 100,
    ingredients: {
      Wood: new Decimal(25),
      Iron: new Decimal(10),
    },
    requiredIsland: "desert",
  },
};

export const TREASURE_TOOLS: Record<TreasureToolName, Tool> = {
  "Sand Shovel": {
    name: "Sand Shovel",
    description: translate("description.sand.shovel"),
    price: 20,
    ingredients: {
      Wood: new Decimal(2),
      Stone: new Decimal(1),
    },
  },
  "Sand Drill": {
    name: "Sand Drill",
    description: translate("description.sand.drill"),
    price: 40,
    ingredients: {
      Gold: new Decimal(1),
      Iron: new Decimal(3),
    },
  },
};
