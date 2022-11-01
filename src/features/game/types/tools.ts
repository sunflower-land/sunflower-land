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
  | "Iron Pickaxe";

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
});
