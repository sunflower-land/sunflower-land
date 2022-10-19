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
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(2),
    },
    sfl: marketRate(5),
  },

  "Stone Pickaxe": {
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(2),
      Stone: new Decimal(3),
    },
    sfl: marketRate(5),
  },
  "Iron Pickaxe": {
    name: "Axe",
    description: "Used to collect wood",
    ingredients: {
      Wood: new Decimal(2),
      Iron: new Decimal(3),
    },
    sfl: marketRate(5),
  },
});
