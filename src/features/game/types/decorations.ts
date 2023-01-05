import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Dimensions } from "./craftables";
import { Inventory } from "./game";

export type AchievementDecorationName =
  | "Chef Bear"
  | "Construction Bear"
  | "Sunflower Bear"
  | "Farmer Bear"
  | "Bear Trap"
  | "Angel Bear"
  | "Brilliant Bear"
  | "Badass Bear"
  | "Classy Bear"
  | "Rich Bear"
  | "Rainbow Artist Bear"
  | "Devil Bear";

export type ShopDecorationName =
  | "White Tulips"
  | "Potted Sunflower"
  | "Potted Potato"
  | "Potted Pumpkin"
  | "Cactus"
  | "Basic Bear";

export type DecorationName = AchievementDecorationName | ShopDecorationName;

export const DECORATION_DIMENSIONS: Record<DecorationName, Dimensions> = {
  "White Tulips": {
    height: 1,
    width: 1,
  },
  "Potted Sunflower": {
    height: 1,
    width: 1,
  },
  "Potted Potato": {
    height: 1,
    width: 1,
  },
  "Potted Pumpkin": {
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
  "Angel Bear": {
    height: 2,
    width: 2,
  },
  "Badass Bear": {
    height: 1,
    width: 1,
  },
  "Bear Trap": {
    height: 2,
    width: 1,
  },
  "Brilliant Bear": {
    height: 1,
    width: 1,
  },
  "Classy Bear": {
    height: 2,
    width: 1,
  },
  "Farmer Bear": {
    height: 1,
    width: 1,
  },
  "Sunflower Bear": {
    height: 1,
    width: 1,
  },
  "Rich Bear": {
    height: 1,
    width: 2,
  },
  "Rainbow Artist Bear": {
    width: 1,
    height: 1,
  },
  "Devil Bear": {
    height: 1,
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
  "Potted Potato": {
    name: "Potted Potato",
    sfl: marketRate(50),
    ingredients: {
      Potato: new Decimal(200),
    },
    description: "Potato blood runs through your Bumpkin.",
  },
  "Potted Pumpkin": {
    name: "Potted Pumpkin",
    sfl: marketRate(200),
    ingredients: {
      Pumpkin: new Decimal(200),
    },
    description: "Pumpkins for Bumpkins",
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
  "Angel Bear": {
    name: "Angel Bear",
    ingredients: {},
    description: "Time to transcend peasant farming",
  },
  "Badass Bear": {
    name: "Basic Bear",
    description: "Nothing stands in your way.",
    ingredients: {},
  },
  "Bear Trap": {
    name: "Bear Trap",
    description: "It's a trap!",
    ingredients: {},
  },
  "Brilliant Bear": {
    name: "Brilliant Bear",
    description: "Pure brilliance!",
    ingredients: {},
  },
  "Classy Bear": {
    name: "Classy Bear",
    description: "More SFL than you know what to do with it!",
    ingredients: {},
  },
  "Farmer Bear": {
    name: "Farmer Bear",
    description: "Nothing quite like a hard day's work!",
    ingredients: {},
  },
  "Sunflower Bear": {
    name: "Sunflower Bear",
    description: "A Bear's cherished crop",
    ingredients: {},
  },
  "Rich Bear": {
    name: "Rich Bear",
    description: "A prized possession",
    ingredients: {},
  },
  "Rainbow Artist Bear": {
    name: "Rainbow Artist Bear",
    description: "The owner is a beautiful bear artist!",
    ingredients: {},
  },
  "Devil Bear": {
    name: "Devil Bear",
    ingredients: {},
    description: "Better the Devil you know than the Devil you don't",
  },
});
