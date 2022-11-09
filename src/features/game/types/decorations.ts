import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Dimensions } from "./craftables";

export type DecorationName =
  | "White Tulips"
  | "Potted Sunflower"
  | "Cactus"
  | "Basic Bear"
  | "Chef Bear"
  | "Construction Bear";

export const DECORATION_DIMENSIONS: Record<DecorationName, Dimensions> = {
  "White Tulips": {
    height: 1,
    width: 1,
  },
  "Potted Sunflower": {
    height: 1,
    width: 1,
  },
  Cactus: {
    height: 1,
    width: 1,
  },
  "Basic Bear": {
    height: 1,
    width: 1,
  },
  "Chef Bear": {
    height: 2,
    width: 1,
  },
  "Construction Bear": {
    height: 2,
    width: 1,
  },
};

export type Decoration = {
  name: DecorationName;
  ingredients: Inventory;
  description: string;
  // If no SFL it is not available for purchase
  sfl?: Decimal;
};

export const DECORATIONS: () => Record<DecorationName, Decoration> = () => ({
  "White Tulips": {
    name: "White Tulips",
    sfl: marketRate(20),
    ingredients: {},
    description: "Keep the smell of goblins away.",
  },
  "Potted Sunflower": {
    name: "Potted Sunflower",
    sfl: marketRate(20),
    ingredients: {
      Sunflower: new Decimal(100),
    },
    description: "Brighten up your land.",
  },
  Cactus: {
    name: "Cactus",
    sfl: marketRate(20),
    ingredients: {},
    description: "Saves water and makes your farm look stunning!",
  },
  "Basic Bear": {
    name: "Basic Bear",
    sfl: marketRate(50),
    ingredients: {},
    description: "A basic bear. Use this at Goblin Retreat to build a bear!",
  },
  "Chef Bear": {
    name: "Chef Bear",
    ingredients: {},
    description: "Every chef needs a helping hand",
  },
  "Construction Bear": {
    name: "Construction Bear",
    ingredients: {},
    description: "Always build in a bear market",
  },
});
