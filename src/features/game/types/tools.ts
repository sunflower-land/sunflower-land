/**
 * Legacy tool settings can be found in craftables.ts
 */

import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Inventory } from "./game";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Rusty Shovel"
  | "Power Shovel";

export type TreasureToolName = "Sand Shovel" | "Sand Drill";

export interface Tool {
  name: string;
  description: string;
  ingredients: Inventory;
  sfl: Decimal;
  disabled?: boolean;
}

export const WORKBENCH_TOOLS: Record<WorkbenchToolName, Tool> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {},
    sfl: marketRate(5),
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    ingredients: {
      Wood: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    ingredients: {
      Wood: new Decimal(5),
      Stone: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Iron Pickaxe": {
    name: "Iron Axe",
    description: "Used to collect gold",
    ingredients: {
      Wood: new Decimal(10),
      Iron: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description: "Used to move buildings and collectibles",
    ingredients: {},
    sfl: marketRate(5),
  },
  "Power Shovel": {
    name: "Power Shovel",
    description: "Used for landscaping",
    ingredients: {
      Diamond: new Decimal(5),
      Gold: new Decimal(5),
    },
    sfl: marketRate(5),
  },
};

export const TREASURE_TOOLS: Record<TreasureToolName, Tool> = {
  "Sand Shovel": {
    name: "Sand Shovel",
    description: "Used for digging treasure",
    ingredients: {
      Wood: new Decimal(2),
      Stone: new Decimal(1),
    },
    sfl: marketRate(5),
  },
  "Sand Drill": {
    name: "Sand Drill",
    description: "Drill deep for rare treasure",
    ingredients: {
      Gold: new Decimal(1),
    },
    sfl: marketRate(10),
  },
};
