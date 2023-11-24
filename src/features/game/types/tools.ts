/**
 * Legacy tool settings can be found in craftables.ts
 */

import Decimal from "decimal.js-light";
import { GameState, Inventory } from "./game";
import { translate } from "lib/i18n/translate";

export type WorkbenchToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Rod";

export type TreasureToolName = "Sand Shovel" | "Sand Drill";

export interface Tool {
  name: string;
  description: string;
  ingredients: Inventory;
  sfl: Decimal;
  disabled?: boolean;
}

export const WORKBENCH_TOOLS: (
  gameState?: GameState
) => Record<WorkbenchToolName, Tool> = () => ({
  Axe: {
    name: "Axe",
    description: translate("description.axe"),
    ingredients: {},
    sfl: new Decimal(0.0625),
  },
  Pickaxe: {
    name: "Pickaxe",
    description: translate("description.pickaxe"),
    ingredients: {
      Wood: new Decimal(3),
    },
    sfl: new Decimal(0.0625),
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: translate("description.stone.pickaxe"),
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(5),
    },
    sfl: new Decimal(0.0625),
  },
  "Iron Pickaxe": {
    name: "Iron Axe",
    description: translate("description.iron.pickaxe"),
    ingredients: {
      Wood: new Decimal(3),
      Iron: new Decimal(5),
    },
    sfl: new Decimal(0.25),
  },
  Rod: {
    name: "Rod",
    description: translate("description.rod"),
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(1),
    },
    sfl: new Decimal(0.0625),
  },
});

export const TREASURE_TOOLS: Record<TreasureToolName, Tool> = {
  "Sand Shovel": {
    name: "Sand Shovel",
    description: translate("description.sand.shovel"),
    ingredients: {
      Wood: new Decimal(2),
      Stone: new Decimal(1),
    },
    sfl: new Decimal(0.0625),
  },
  "Sand Drill": {
    name: "Sand Drill",
    description: translate("description.sand.drill"),
    ingredients: {
      Gold: new Decimal(1),
      Iron: new Decimal(3),
    },
    sfl: new Decimal(0.125),
  },
};
