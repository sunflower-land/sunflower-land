/**
 * Legacy tool settings can be found in craftables.ts
 */

import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Power Shovel"
  | "Shovel"
  | "Rusty Shovel";

export type WorkbenchTool = {
  sfl: Decimal;
  ingredients: Inventory;
  description: string;
};

export const WORKBENCH_TOOLS: () => Record<
  WorkbenchToolName,
  WorkbenchTool
> = () => ({
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {},
    sfl: marketRate(5),
  },
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description: "Used to remove buildings and collectibles",
    ingredients: {},
    sfl: marketRate(5),
  },
  Shovel: {
    name: "Shovel",
    description: "Used to remove unwanted crops",
    sfl: marketRate(5),
    ingredients: {
      Iron: new Decimal(10),
      Wood: new Decimal(20),
    },
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(5),
      Stone: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(10),
      Iron: new Decimal(5),
    },
    sfl: marketRate(5),
  },
  "Power Shovel": {
    name: "Power Shovel",
    description: "Used for landscaping",
    ingredients: {
      Diamond: new Decimal(2),
      Gold: new Decimal(5),
    },
    sfl: marketRate(5),
  },
});
