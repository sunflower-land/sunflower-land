/**
 * Legacy tool settings can be found in craftables.ts
 */

import Decimal from "decimal.js-light";
import { Inventory } from "./game";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe";

export type TreasureToolName = "Sand Shovel" | "Sand Drill";

export interface Tool {
  name: string;
  description: string;
  ingredients: Inventory;
  sfl: Decimal;
  disabled?: boolean;
}

export const WORKBENCH_TOOLS: () => Record<WorkbenchToolName, Tool> = () => ({
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {},
    sfl: new Decimal(0.0625),
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    ingredients: {
      Wood: new Decimal(3),
    },
    sfl: new Decimal(0.0625),
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(5),
    },
    sfl: new Decimal(0.0625),
  },
  "Iron Pickaxe": {
    name: "Iron Axe",
    description: "Used to collect gold",
    ingredients: {
      Wood: new Decimal(3),
      Iron: new Decimal(5),
    },
    sfl: new Decimal(0.25),
  },
});

export const TREASURE_TOOLS: Record<TreasureToolName, Tool> = {
  "Sand Shovel": {
    name: "Sand Shovel",
    description: "Used for digging treasure",
    ingredients: {
      Wood: new Decimal(2),
      Stone: new Decimal(1),
    },
    sfl: new Decimal(0.0625),
  },
  "Sand Drill": {
    name: "Sand Drill",
    description: "Drill deep for uncommon or rare treasure",
    ingredients: {
      Gold: new Decimal(1),
      Iron: new Decimal(3),
    },
    sfl: new Decimal(0.125),
  },
};
